// المساعد الذكي المتكامل - الملف الرئيسي
// AI Assistant Main File - يجمع جميع المكونات

(function() {
    'use strict';

    console.log('🚀 تحميل المساعد الذكي...');

    // التحقق من دعم المتصفح
    const checkBrowserSupport = () => {
        const support = {
            speech: 'speechSynthesis' in window,
            recognition: ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window),
            audio: 'AudioContext' in window || 'webkitAudioContext' in window,
            fetch: 'fetch' in window,
            localStorage: 'localStorage' in window
        };

        console.log('🔍 دعم المتصفح:', support);

        if (!support.localStorage) {
            console.error('❌ المتصفح لا يدعم localStorage');
            return false;
        }

        if (!support.speech) {
            console.warn('⚠️ المتصفح لا يدعم التحدث الصوتي');
        }

        if (!support.recognition) {
            console.warn('⚠️ المتصفح لا يدعم التعرف الصوتي');
        }

        return true;
    };

    // طلب إذن الميكروفون (للاستضافة HTTPS)
    const requestMicrophonePermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('⚠️ getUserMedia غير مدعوم');
            return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            console.log('✅ تم منح إذن الميكروفون');
            return true;
        } catch (error) {
            console.warn('⚠️ لم يتم منح إذن الميكروفون:', error.message);
            return false;
        }
    };

    // تهيئة النظام
    const initialize = async () => {
        // التحقق من الدعم
        if (!checkBrowserSupport()) {
            console.error('❌ المتصفح غير مدعوم');
            return;
        }

        // طلب إذن الميكروفون (فقط على HTTPS)
        if (location.protocol === 'https:') {
            await requestMicrophonePermission();
        } else {
            console.warn('⚠️ الميكروفون يعمل فقط على HTTPS');
        }

        // تحميل البيانات المحلية
        if (window.AIDatabase) {
            window.AIDatabase.init();
        }

        // تهيئة محرك الصوت
        if (window.AISpeech) {
            window.AISpeech.init();
        }

        console.log('✅ المساعد الذكي جاهز للاستخدام!');
        console.log('💡 اضغط Ctrl+Shift+A لفتح المساعد');
    };

    // تشغيل عند جاهزية الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // رسالة ترحيبية
    console.log(`
    ╔═══════════════════════════════════════╗
    ║   🤖 المساعد الذكي لإدارة المخازن   ║
    ║                                       ║
    ║   ✅ قاعدة معرفة شاملة               ║
    ║   ✅ تعرف صوتي باللهجة المصرية      ║
    ║   ✅ رد صوتي طبيعي                   ║
    ║   ✅ تحقق من صحة المدخلات            ║
    ║   ✅ بحث ذكي سريع                    ║
    ║   ✅ جاهز للربط بقاعدة بيانات        ║
    ║                                       ║
    ║   اختصار: Ctrl+Shift+A              ║
    ╚═══════════════════════════════════════╝
    `);

})();
