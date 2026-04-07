// Supabase Singleton Client - توحيد الاتصال
// سلامتك - Auth System v11.0
(function() {
    'use strict';

    // Singleton Pattern - نسخة واحدة فقط
    let supabaseInstance = null;
    let isInitializing = false;

    // إعدادات Supabase الموحدة
    const SUPABASE_CONFIG = {
        url: 'https://iksjhjxwphmvthryfeae.supabase.co',
        key: 'sb_publishable_0DUy2mtXS6m5S8PwTDAANQ_XWlzbu0G',
        storage: {
            sessionKey: 'supabase.auth.token',
            userKey: 'currentUser',
            warehouseKey: 'activeWarehouseId'
        }
    };

    // إنشاء نسخة واحدة من Supabase Client
    function createSupabaseClient() {
        if (supabaseInstance) {
            console.log('✅ استخدام Supabase Client الموجود');
            return supabaseInstance;
        }

        if (isInitializing) {
            console.log('⏳ انتظار تهيئة Supabase Client...');
            return null;
        }

        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase SDK غير محمل');
            return null;
        }

        isInitializing = true;

        try {
            console.log('🚀 إنشاء Supabase Client جديد...');
            
            supabaseInstance = window.supabase.createClient(
                SUPABASE_CONFIG.url, 
                SUPABASE_CONFIG.key, 
                {
                    auth: {
                        persistSession: true,           // تثبيت الجلسة - مرة واحدة وبس
                        storage: window.localStorage,   // localStorage أساسي
                        autoRefreshToken: true,        // تحديث التوكن تلقائياً
                        detectSessionInUrl: true,      // كشف الجلسة من URL
                        flow: 'pkce'                   // PKCE flow للأمان
                    }
                }
            );

            console.log('✅ تم إنشاء Supabase Client بنجاح');
            isInitializing = false;
            return supabaseInstance;

        } catch (error) {
            console.error('❌ خطأ في إنشاء Supabase Client:', error);
            isInitializing = false;
            return null;
        }
    }

    // مدير الجلسات المحسّن - getSession مرة واحدة فقط
    const SessionManager = {
        // التحقق من الجلسة (تحميل فوري إذا موجودة - بدون دائرة)
        async checkSession() {
            const client = createSupabaseClient();
            if (!client) {
                console.error('❌ لا يمكن الوصول لـ Supabase Client');
                return null;
            }

            try {
                console.log('🔍 التحقق من الجلسة (تحميل فوري إذا موجودة)...');
                
                // التحقق الأول من localStorage للسرعة القصوى - فتح فوراً
                const storedSession = localStorage.getItem(SUPABASE_CONFIG.storage.sessionKey);
                if (storedSession) {
                    try {
                        const sessionData = JSON.parse(storedSession);
                        if (sessionData.access_token && sessionData.user_id) {
                            console.log('⚡ جلسة محفوظة في localStorage - فتح الصفحة فوراً في أقل من ثانية');
                            return { user: { id: sessionData.user_id, email: sessionData.email } };
                        }
                    } catch (parseError) {
                        console.warn('⚠️ خطأ في قراءة localStorage:', parseError);
                        localStorage.removeItem(SUPABASE_CONFIG.storage.sessionKey);
                    }
                }
                
                // جلب الجلسة من Supabase (مرة واحدة فقط - بدون دائرة)
                console.log('🔄 استدعاء getSession من Supabase (مرة واحدة فقط)...');
                const { data: { session }, error } = await client.auth.getSession();
                
                if (error) {
                    console.error('❌ خطأ في جلب الجلسة:', error);
                    this.clearSession();
                    return null;
                }

                if (session && session.user) {
                    console.log('✅ جلسة صالحة من Supabase:', session.user.email);
                    this.saveUserToStorage(session.user);
                    return session;
                }

                // تم حذف رسالة 'لا توجد جلسة نشطة' - Console نظيف
                return null;

            } catch (error) {
                console.error('❌ خطأ في التحقق من الجلسة:', error);
                return null;
            }
        },

        // التأكد من المصادقة (توجيه فقط إذا session = null)
        async ensureAuthenticated(redirectUrl = 'login.html') {
            try {
                const session = await this.checkSession();
                
                // لا توجيه إلا إذا تأكدنا يقيناً أن session = null
                if (session === null) {
                    console.log('🔄 session = null - توجيه فوري لـ Login...');
                    window.location.href = redirectUrl;
                    return false;
                }
                
                console.log('✅ جلسة موجودة - فتح الصفحة فوراً');
                return true;

            } catch (error) {
                console.error('❌ خطأ في التحقق من المصادقة:', error);
                // في حالة الخطأ، توجيه للـ Login
                window.location.href = redirectUrl;
                return false;
            }
        },

        // حفظ بيانات المستخدم
        saveUserToStorage(user) {
            if (!user) return;

            try {
                const userData = {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email,
                    phone: user.user_metadata?.phone || '',
                    region: user.user_metadata?.region || ''
                };

                localStorage.setItem(SUPABASE_CONFIG.storage.userKey, JSON.stringify(userData));
                console.log('💾 تم حفظ بيانات المستخدم');
            } catch (error) {
                console.error('❌ خطأ في حفظ بيانات المستخدم:', error);
            }
        },

        // جلب بيانات المستخدم
        getUserFromStorage() {
            try {
                const stored = localStorage.getItem(SUPABASE_CONFIG.storage.userKey);
                return stored ? JSON.parse(stored) : null;
            } catch (error) {
                console.error('❌ خطأ في جلب بيانات المستخدم:', error);
                return null;
            }
        },

        // مسح الجلسة
        clearSession() {
            try {
                localStorage.removeItem(SUPABASE_CONFIG.storage.sessionKey);
                localStorage.removeItem(SUPABASE_CONFIG.storage.userKey);
                localStorage.removeItem(SUPABASE_CONFIG.storage.warehouseKey);
                console.log('🗑️ تم مسح الجلسة');
            } catch (error) {
                console.error('❌ خطأ في مسح الجلسة:', error);
            }
        }
    };

    // مدير المخازن
    const WarehouseManager = {
        // تعيين المخزن النشط
        setActiveWarehouse(warehouseId) {
            try {
                localStorage.setItem(SUPABASE_CONFIG.storage.warehouseKey, warehouseId);
                console.log('🏭 تم تعيين المخزن النشط:', warehouseId);
            } catch (error) {
                console.error('❌ خطأ في تعيين المخزن:', error);
            }
        },

        // جلب المخزن النشط
        getActiveWarehouse() {
            try {
                return localStorage.getItem(SUPABASE_CONFIG.storage.warehouseKey);
            } catch (error) {
                console.error('❌ خطأ في جلب المخزن النشط:', error);
                return null;
            }
        }
    };

    // دالة التهيئة التلقائية (مع منع الـ Infinite Loop)
    let isInitialized = false;
    async function initSupabaseSingleton() {
        if (isInitialized) {
            console.log('✅ Supabase Singleton مهيأ بالفعل');
            return;
        }

        isInitialized = true;
        console.log('🚀 تهيئة Supabase Singleton...');

        try {
            const client = createSupabaseClient();
            if (!client) {
                console.error('❌ فشل في تهيئة Supabase Client');
                return;
            }

            // التحقق من الجلسة (مرة واحدة فقط)
            const session = await SessionManager.checkSession();
            if (session && session.user) {
                SessionManager.saveUserToStorage(session.user);
            }

            console.log('✅ Supabase Singleton جاهز');

        } catch (error) {
            console.error('❌ خطأ في تهيئة Supabase Singleton:', error);
        }
    }

    // تهيئة تلقائية عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupabaseSingleton);
    } else {
        initSupabaseSingleton();
    }

    // تصدير الدوال للاستخدام العام
    window.SupabaseSingleton = {
        SessionManager,
        WarehouseManager,
        getClient: createSupabaseClient,
        SUPABASE_CONFIG
    };

    console.log('✅ تم تحميل Supabase Singleton Module');
})();
