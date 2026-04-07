// محرك التعرف الصوتي المحسن للغة العربية مع ربط Supabase
(function() {
    'use strict';

    const hasSpeech = 'speechSynthesis' in window;
    const hasRecognition = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

    // إعدادات Supabase - يجب تعديل هذه القيم
    const SUPABASE_URL = 'https://your-project-id.supabase.co'; // ضع هنا رابط Supabase
    const SUPABASE_ANON_KEY = 'your-supabase-anon-key'; // ضع هنا مفتاح Supabase

    window.AISpeech = {
        isListening: false,
        isSpeaking: false,
        recognition: null,
        retryCount: 0,
        maxRetries: 3,

        // تهيئة محرك التعرف الصوتي
        init: function() {
            if (!hasRecognition) {
                console.warn('❌ Speech Recognition not supported in this browser');
                return false;
            }

            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                
                // إعدادات التعرف الصوتي المحسنة للغة العربية
                this.recognition.lang = 'ar-EG'; // اللهجة المصرية
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.maxAlternatives = 3;
                this.recognition.timeout = 5000; // مهلة 5 ثواني

                console.log('✅ Speech Recognition initialized successfully');
                return true;
            } catch (error) {
                console.error('❌ Failed to initialize Speech Recognition:', error);
                return false;
            }
        },

        // بدء الاستماع مع معالجة أفضل للأخطاء
        startListening: function(onResult, onError) {
            if (!this.recognition) {
                if (!this.init()) {
                    if (onError) onError('not-supported');
                    return;
                }
            }

            if (this.isListening) {
                this.stopListening();
                return;
            }

            this.recognition.onstart = () => {
                this.isListening = true;
                this.retryCount = 0;
                console.log('🎤 بدء الاستماع...');
                
                // إشعار للمستخدم
                if (window.AIUI) {
                    window.AIUI.addMessage('🎤 <strong>جاري الاستماع...</strong><br>تحدث بوضوح في الميكروفون', 'bot', false);
                }
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                
                console.log('📝 النص المعترف به:', transcript, 'الثقة:', confidence);
                
                // معالجة النص الصوتي واستخراج البيانات
                const processedData = this.processArabicSpeech(transcript);
                
                // إرسال حدث مخصص للاستماع الخارجي
                const voiceEvent = new CustomEvent('voice-result', {
                    detail: { 
                        transcript: processedData.transcript, 
                        confidence: confidence,
                        extractedData: processedData.extractedData
                    }
                });
                window.dispatchEvent(voiceEvent);
                
                if (onResult) onResult(processedData.transcript, confidence, processedData.extractedData);
            };

            this.recognition.onerror = (event) => {
                console.error('❌ خطأ في التعرف الصوتي:', event.error);
                this.isListening = false;
                
                // معالجة الأخطاء الشائعة
                let errorMessage = '';
                let shouldRetry = false;
                
                switch(event.error) {
                    case 'no-speech':
                        errorMessage = '🔇 لم يتم اكتشاف أي صوت<br>يرجى التحدث بوضوح في الميكروفون';
                        shouldRetry = true;
                        break;
                    case 'audio-capture':
                        errorMessage = '🎤 لا يمكن الوصول إلى الميكروفون<br>يرجى التحقق من إذن الميكروفون';
                        break;
                    case 'not-allowed':
                        errorMessage = '🚫 تم رفض إذن الميكروفون<br>يرجى السماح بالوصول إلى الميكروفون في إعدادات المتصفح';
                        break;
                    case 'network':
                        errorMessage = '🌐 مشكلة في الاتصال بالإنترنت<br>يرجى التحقق من اتصالك بالإنترنت';
                        shouldRetry = true;
                        break;
                    case 'service-not-allowed':
                        errorMessage = '🚫 خدمة التعرف الصوتي غير متاحة<br>يرجى المحاولة مرة أخرى';
                        shouldRetry = true;
                        break;
                    default:
                        errorMessage = `❌ خطأ في التعرف الصوتي: ${event.error}<br>يرجى المحاولة مرة أخرى`;
                        shouldRetry = true;
                }
                
                // إرسال رسالة الخطأ للمساعد
                if (window.AIUI) {
                    window.AIUI.addMessage(errorMessage, 'bot', false);
                }
                
                // إعادة المحاولة تلقائياً
                if (shouldRetry && this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    console.log(`🔄 إعادة المحاولة (${this.retryCount}/${this.maxRetries})`);
                    setTimeout(() => {
                        this.startListening(onResult, onError);
                    }, 2000);
                    return;
                }
                
                if (onError) onError(event.error);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                console.log('🎤 توقف الاستماع');
                
                // إشعار بانتهاء الاستماع
                if (window.AIUI && this.retryCount >= this.maxRetries) {
                    window.AIUI.addMessage('🔇 <strong>توقف الاستماع</strong><br>يمكنك الضغط على زر الميكروفون مرة أخرى', 'bot', false);
                }
            };

            try {
                this.recognition.start();
            } catch (e) {
                console.error('❌ فشل بدء التعرف الصوتي:', e);
                if (onError) onError('start-failed');
                
                if (window.AIUI) {
                    window.AIUI.addMessage('❌ <strong>فشل بدء الميكروفون!</strong><br>يرجى تحديث الصفحة والمحاولة مرة أخرى', 'bot', false);
                }
            }
        },

        // معالجة الكلام العربي المركب باستخدام المحول الذكي
        processArabicSpeech: function(transcript) {
            const originalText = transcript.toLowerCase().trim();
            let processedData = {
                transcript: originalText,
                extractedData: {}
            };
            
            console.log('🔍 معالجة النص العربي الذكية:', originalText);
            
            // 1. استخدام المحول الذكي لتحويل الأرقام والكسور العامية
            // نتحقق من وجود المحول في البيئة العالمية (من ملف voice-input.js)
            if (typeof ArabicNumberConverter !== 'undefined') {
                if (!this.converter) {
                    this.converter = new ArabicNumberConverter();
                }
                
                // تحويل النص إلى أرقام (مثلاً: "مية وحداشر ونص" -> "111.5")
                const numericText = this.converter.convertRealTime(originalText);
                console.log('🔢 النص بعد التحويل الرقمي:', numericText);
                
                // تحديث النص المعالج للخطوات التالية
                const words = numericText.split(/\s+/);
                
                // استخراج السعر (Price)
                // نبحث عن نمط الرقم المتبوع بعملة أو المسبوق بكلمة سعر
                const pricePattern = /(\d+(?:\.\d+)?)\s*(?:جنيه|جنيها|ج|ريال|درهم|دولار|بـ|سعر)/i;
                const priceMatch = numericText.match(pricePattern);
                if (priceMatch) {
                    processedData.extractedData.price = parseFloat(priceMatch[1]);
                    console.log('💰 تم استخراج السعر الذكي:', processedData.extractedData.price);
                }
                
                // استخراج الكمية (Quantity)
                // نبحث عن رقم متبوع بكلمات مثل "علبة، شريط، واحد، كمية" أو رقم وحيد
                const quantityPattern = /(?:الكمية|عدد|هات|عايز)\s+(\d+)|(\d+)\s+(?:علبة|شريط|قرص|وحدة|قطعة|كرتونة)/i;
                const qtyMatch = numericText.match(quantityPattern);
                if (qtyMatch) {
                    processedData.extractedData.quantity = parseInt(qtyMatch[1] || qtyMatch[2]);
                    console.log('📦 تم استخراج الكمية الذكية:', processedData.extractedData.quantity);
                }
                
                // استخراج اسم المنتج (Product Name)
                // نستخدم قاعدة بيانات الأدوية الموسعة في المحول
                let foundProduct = '';
                for (const word of words) {
                    if (this.converter.productDatabase[word]) {
                        foundProduct = this.converter.productDatabase[word];
                        break;
                    }
                }
                
                // إذا لم نجد كلمة واحدة، نبحث عن اسم مركب
                if (!foundProduct) {
                    for (const productKey in this.converter.productDatabase) {
                        if (numericText.includes(productKey)) {
                            foundProduct = this.converter.productDatabase[productKey];
                            break;
                        }
                    }
                }
                
                if (foundProduct) {
                    processedData.extractedData.productName = foundProduct;
                    console.log('💊 تم استخراج الدواء الذكي:', foundProduct);
                }
            } else {
                // نظام احتياطي (Fallback) في حال عدم تحميل المحول المتقدم
                console.warn('⚠️ المحول الذكي غير متوفر، استخدام النظام التقليدي');
                
                // استخراج بسيط للسعر
                const simplePriceMatch = originalText.match(/(\d+)\s*(?:جنيه|ريال)/);
                if (simplePriceMatch) processedData.extractedData.price = parseInt(simplePriceMatch[1]);
                
                // استخراج بسيط للاسم
                const fallbackNames = ['بنادول', 'أسبوسيد', 'فولتارين', 'كتوفان', 'بروفين', 'سيتال'];
                for (const name of fallbackNames) {
                    if (originalText.includes(name)) {
                        processedData.extractedData.productName = name;
                        break;
                    }
                }
            }

            
            // استخراج التواريخ
            const dateMatch = originalText.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
            if (dateMatch) {
                const [, day, month, year] = dateMatch;
                const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                
                // إذا كان التاريخ في المستقبل، ضعه كتاريخ انتهاء
                const dateObj = new Date(formattedDate);
                const today = new Date();
                
                if (dateObj > today) {
                    processedData.extractedData.expiryDate = formattedDate;
                    console.log(`✅ تم العثور على تاريخ الانتهاء: ${formattedDate}`);
                } else {
                    processedData.extractedData.productionDate = formattedDate;
                    console.log(`✅ تم العثور على تاريخ الإنتاج: ${formattedDate}`);
                }
            }
            
            console.log('🎯 البيانات المستخرجة النهائية:', processedData.extractedData);
            return processedData;
        },

        // حفظ البيانات في Supabase
        saveToSupabase: async function(productData) {
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/pharmacy_products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({
                        product_name: productData.productName,
                        price: productData.price,
                        discount: productData.discount || 0,
                        quantity: productData.quantity || 0,
                        production_date: productData.productionDate || null,
                        expiry_date: productData.expiryDate || null
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ تم حفظ البيانات في Supabase:', result);
                    
                    if (window.AIUI) {
                        window.AIUI.addMessage('✅ <strong>تم حفظ المنتج بنجاح في قاعدة البيانات!</strong>', 'bot', false);
                    }
                    
                    return { success: true, data: result };
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error('❌ خطأ في حفظ البيانات في Supabase:', error);
                
                if (window.AIUI) {
                    window.AIUI.addMessage(`❌ <strong>فشل حفظ البيانات!</strong><br>${error.message}`, 'bot', false);
                }
                
                return { success: false, error: error.message };
            }
        },

        stopListening: function() {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
                this.isListening = false;
                console.log('🛑 تم إيقاف الاستماع');
            }
        },

        // نطق النصوص
        speak: function(text) {
            if (!hasSpeech) {
                console.warn('❌ Speech Synthesis not supported');
                return;
            }

            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ar-EG';
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 1;
                
                utterance.onstart = () => {
                    this.isSpeaking = true;
                    console.log('🔊 بدء النطق:', text);
                };
                
                utterance.onend = () => {
                    this.isSpeaking = false;
                    console.log('🔊 انتهاء النطق');
                };
                
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('❌ خطأ في النطق:', error);
            }
        }
    };

    // تهيئة تلقائية
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            console.log('🚀 تهيئة محرك الصوتي العربي مع ربط Supabase');
            console.log('📝 لا تنسى تعديل SUPABASE_URL و SUPABASE_ANON_KEY في الملف');
        });
    }
})();
