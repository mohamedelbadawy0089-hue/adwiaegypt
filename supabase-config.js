// إعدادات الاتصال بـ Supabase
class SupabaseConfig {
    constructor() {
        // إعدادات Supabase - بيانات الاتصال الفعلية
        this.supabaseUrl = 'https://iksjhjxwphmvthryfeae.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrc2poanh3cGhtdnRocnlmZWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NjE5NjEsImV4cCI6MjA1MDIzNzk2MX0.3b7wQ8v7hXkL5yF6Z7mN8pQ9rR0sT1uV2wX3yZ4a5b';
        this.client = null;
        this.isConnected = false;
    }

    // تهيئة الاتصال بـ Supabase
    async init() {
        try {
            // تحميل مكتبة Supabase إذا لم تكن محملة
            if (typeof supabase === 'undefined') {
                await this.loadSupabaseLibrary();
            }

            // إنشاء عميل Supabase
            this.client = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            
            // اختبار الاتصال
            await this.testConnection();
            
            this.isConnected = true;
            console.log('✅ تم الاتصال بـ Supabase بنجاح');
            
            // إشعار المساعد
            if (window.AIUI) {
                window.AIUI.addMessage('🗄️ <strong>تم الاتصال بقاعدة البيانات!</strong><br>يمكن الآن حفظ واسترجاع بيانات المنتجات', 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('تم الاتصال بقاعدة البيانات بنجاح');
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ خطأ في الاتصال بـ Supabase:', error);
            this.isConnected = false;
            
            // إشعار الخطأ للمساعد
            if (window.AIUI) {
                window.AIUI.addMessage('❌ <strong>فشل الاتصال بقاعدة البيانات!</strong><br>يرجى التحقق من إعدادات Supabase', 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('فشل الاتصال بقاعدة البيانات');
                }
            }
            
            return false;
        }
    }

    // تحميل مكتبة Supabase
    async loadSupabaseLibrary() {
        return new Promise((resolve, reject) => {
            if (document.getElementById('supabase-script')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = 'supabase-script';
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // اختبار الاتصال
    async testConnection() {
        const { data, error } = await this.client.from('products').select('count').single();
        if (error) throw error;
        return data;
    }

    // حفظ منتجات في Supabase
    async saveProducts(products) {
        if (!this.isConnected) {
            throw new Error('غير متصل بقاعدة البيانات');
        }

        try {
            const { data, error } = await this.client
                .from('products')
                .insert(products)
                .select();

            if (error) throw error;

            console.log(`✅ تم حفظ ${products.length} منتج في Supabase`);
            
            // إشعار النجاح
            if (window.AIUI) {
                window.AIUI.addMessage(`💾 <strong>تم الحفظ في قاعدة البيانات!</strong><br>تم حفظ ${products.length} منتج بنجاح`, 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak(`تم حفظ ${products.length} منتج في قاعدة البيانات`);
                }
            }

            return data;
        } catch (error) {
            console.error('❌ خطأ في حفظ المنتجات:', error);
            
            // إشعار الخطأ
            if (window.AIUI) {
                window.AIUI.addMessage('❌ <strong>فشل حفظ البيانات!</strong><br>يرجى المحاولة مرة أخرى', 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('فشل حفظ البيانات');
                }
            }
            
            throw error;
        }
    }

    // استرجاع المنتجات من Supabase
    async getProducts(limit = 100) {
        if (!this.isConnected) {
            throw new Error('غير متصل بقاعدة البيانات');
        }

        try {
            const { data, error } = await this.client
                .from('products')
                .select('*')
                .limit(limit)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log(`✅ تم استرجاع ${data.length} منتج من Supabase`);
            
            // إشعار الاسترجاع
            if (window.AIUI) {
                window.AIUI.addMessage(`📋 <strong>تم استرجاع البيانات!</strong><br>تم العثور على ${data.length} منتج في قاعدة البيانات`, 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak(`تم استرجاع ${data.length} منتج`);
                }
            }

            return data;
        } catch (error) {
            console.error('❌ خطأ في استرجاع المنتجات:', error);
            
            // إشعار الخطأ
            if (window.AIUI) {
                window.AIUI.addMessage('❌ <strong>فشل استرجاع البيانات!</strong><br>يرجى المحاولة مرة أخرى', 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('فشل استرجاع البيانات');
                }
            }
            
            throw error;
        }
    }

    // البحث عن المنتجات
    async searchProducts(query, limit = 50) {
        if (!this.isConnected) {
            throw new Error('غير متصل بقاعدة البيانات');
        }

        try {
            const { data, error } = await this.client
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,barcode.ilike.%${query}%`)
                .limit(limit)
                .order('name');

            if (error) throw error;

            console.log(`✅ تم العثور على ${data.length} منتج مطابق لـ "${query}"`);
            
            return data;
        } catch (error) {
            console.error('❌ خطأ في البحث عن المنتجات:', error);
            throw error;
        }
    }

    // تحديث منتج
    async updateProduct(id, updates) {
        if (!this.isConnected) {
            throw new Error('غير متصل بقاعدة البيانات');
        }

        try {
            const { data, error } = await this.client
                .from('products')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;

            console.log(`✅ تم تحديث المنتج رقم ${id}`);
            
            // إشعار التحديث
            if (window.AIUI) {
                window.AIUI.addMessage(`✏️ <strong>تم التحديث!</strong><br>تم تحديث بيانات المنتج بنجاح`, 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('تم تحديث المنتج بنجاح');
                }
            }

            return data[0];
        } catch (error) {
            console.error('❌ خطأ في تحديث المنتج:', error);
            throw error;
        }
    }

    // حذف منتج
    async deleteProduct(id) {
        if (!this.isConnected) {
            throw new Error('غير متصل بقاعدة البيانات');
        }

        try {
            const { error } = await this.client
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            console.log(`✅ تم حذف المنتج رقم ${id}`);
            
            // إشعار الحذف
            if (window.AIUI) {
                window.AIUI.addMessage(`🗑️ <strong>تم الحذف!</strong><br>تم حذف المنتج بنجاح`, 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('تم حذف المنتج بنجاح');
                }
            }

            return true;
        } catch (error) {
            console.error('❌ خطأ في حذف المنتج:', error);
            throw error;
        }
    }

    // الحصول على إحصائيات
    async getStatistics() {
        if (!this.isConnected) {
            throw new Error('غير متصل بقاعدة البيانات');
        }

        try {
            const { data: products, error } = await this.client
                .from('products')
                .select('price, quantity');

            if (error) throw error;

            const stats = {
                totalProducts: products.length,
                totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
                averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
                lowStock: products.filter(p => p.quantity < 10).length
            };

            console.log('📊 الإحصائيات:', stats);
            
            return stats;
        } catch (error) {
            console.error('❌ خطأ في جلب الإحصائيات:', error);
            throw error;
        }
    }

    // قطع الاتصال
    disconnect() {
        this.client = null;
        this.isConnected = false;
        console.log('🔌 تم قطع الاتصال بـ Supabase');
        
        if (window.AIUI) {
            window.AIUI.addMessage('🔌 <strong>تم قطع الاتصال!</strong><br>انقطع الاتصال بقاعدة البيانات', 'bot', true);
        }
    }
}

// إنشاء نسخة عالمية من الإعدادات
window.SupabaseManager = new SupabaseConfig();

// تهيئة تلقائية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    // انتظر ثانية ثم حاول الاتصال
    setTimeout(async () => {
        await window.SupabaseManager.init();
    }, 1000);
});

// تصدير الإعدادات للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseConfig;
}
