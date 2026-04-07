// استمارة تسجيل المخازن - مع نظام الهوية (Auth) - Multi-Tenant
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📝 تهيئة استمارة تسجيل المخازن (Multi-Tenant Mode)');
    
    const form = document.getElementById('warehouseForm');
    if (!form) {
        console.error('❌ لم يتم العثور على استمارة التسجيل');
        return;
    }

    // معالجة تقديم الاستمارة
    form.addEventListener('submit', async function(e) {
        console.log('🔄 بدء معالجة استمارة التسجيل');
        e.preventDefault();

        // جمع البيانات من الاستمارة
        const formData = {
            name: document.getElementById('storeName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            region: document.getElementById('governorate').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirm_password: document.getElementById('confirmPassword').value
        };

        console.log('📋 البيانات المدخلة:', formData);

        // فحص البيانات
        if (!formData.name || !formData.phone || !formData.email || !formData.password) {
            showError('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        if (formData.phone.length !== 11) {
            showError('التليفون يجب أن يكون 11 رقم');
            return;
        }

        if (formData.password !== formData.confirm_password) {
            showError('كلمتا المرور غير متطابقتين');
            return;
        }

        if (formData.password.length < 8) {
            showError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }

        await registerWarehouse(formData);
    });

    console.log('✅ تم تهيئة استمارة التسجيل بنجاح');
});

// دالة تسجيل المخزن
async function registerWarehouse(formData) {
    try {
        console.log('🔐 جاري إنشاء حساب المستخدم...');
        
        // إنشاء حساب المستخدم في Supabase Auth
        const authResult = await AuthManager.signUp(formData.email, formData.password, {
            name: formData.name,
            phone: formData.phone,
            region: formData.region
        });

        if (!authResult.success) {
            showError('فشل إنشاء الحساب: ' + authResult.error);
            return;
        }

        console.log('✅ تم إنشاء حساب المستخدم بنجاح:', authResult.data.user.id);

        // إنشاء سجل المخزن
        const warehouseData = {
            id: authResult.data.user.id,
            user_id: authResult.data.user.id,
            name: formData.name,
            phone: formData.phone,
            region: formData.region,
            email: formData.email,
            is_active: true,
            created_at: new Date().toISOString()
        };

        console.log('💾 جاري حفظ بيانات المخزن...');
        
        // حفظ بيانات المخزن
        const warehouseResult = await WarehouseManager.createWarehouse(warehouseData);
        
        if (!warehouseResult.success) {
            showError('فشل حفظ بيانات المخزن: ' + warehouseResult.error);
            return;
        }

        console.log('✅ تم حفظ بيانات المخزن بنجاح:', warehouseResult.data);

        // حفظ في localStorage
        localStorage.setItem('warehouseData', JSON.stringify({
            ...formData,
            user_id: authResult.data.user.id,
            warehouse_id: warehouseResult.data.id
        }));

        console.log('✅ تم حفظ نسخة احتياطية في localStorage');

        // تعيين المخزن كنشط
        WarehouseManager.setActiveWarehouse(warehouseResult.data.id);

        // نجاح التسجيل
        alert('تم التسجيل بنجاح! تم إنشاء حسابك ومخزنك.');
        window.location.href = 'add-product.html';

    } catch (error) {
        console.error('❌ خطأ غير متوقع:', error);
        showError('حدث خطأ أثناء التسجيل: ' + error.message);
    }
}

// دالة عرض الأخطاء
function showError(message) {
    const errorDiv = document.getElementById('generalError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    alert(message);
}
