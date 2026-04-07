// واجهة المستخدم للمساعد الذكي - UI Component
(function() {
    'use strict';

    // إضافة CSS
    const style = document.createElement('style');
    style.textContent = `
        #aiAssistantBtn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
            z-index: 100001;
            border: 3px solid white;
            transition: transform 0.3s, box-shadow 0.3s;
            user-select: none;
        }
        #aiAssistantBtn:hover {
            transform: scale(1.1) translateY(2px);
            box-shadow: 0 10px 35px rgba(102, 126, 234, 0.8);
        }
        #aiAssistantBtn.listening {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            animation: aiPulse 1.2s infinite;
        }
        #aiAssistantBtn.speaking {
            background: linear-gradient(135deg, #11998e, #38ef7d);
            animation: aiWave 0.8s infinite;
        }
        @keyframes aiPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 6px 25px rgba(240, 147, 251, 0.6); }
            50% { transform: scale(1.15); box-shadow: 0 10px 40px rgba(240, 147, 251, 0.9); }
        }
        @keyframes aiWave {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }
        #aiAssistantPanel {
            display: none;
            position: fixed;
            top: 90px;
            right: 20px;
            width: 260px;
            max-width: calc(100vw - 40px);
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
            z-index: 100000;
            overflow: hidden;
            font-family: Arial, sans-serif;
            border: 2px solid #667eea;
            transition: height 0.3s ease, transform 0.3s ease;
            opacity: 1;
        }
        #aiAssistantPanel.anchored {
            position: absolute !important;
            top: 75px !important;
            right: 0 !important;
        }
        #aiAssistantPanel.minimized {
            height: 48px !important;
        }
        #aiAssistantPanel.open {
            display: block;
            animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ai-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: grab;
            user-select: none;
        }
        .ai-header:active {
            cursor: grabbing;
        }
        .ai-header-title {
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ai-header-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .ai-header-btn {
            cursor: pointer;
            font-size: 24px;
            opacity: 0.8;
            transition: all 0.2s;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ai-header-btn:hover {
            opacity: 1;
            transform: scale(1.2);
        }
        .ai-header-btn.active-mic {
            color: #ff6b6b;
            text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
            animation: aiPulse 1s infinite alternate;
        }
        .ai-body {
            padding: 15px;
            max-height: 320px;
            overflow-y: auto;
            background: #fdfdfd;
        }
        .ai-body::-webkit-scrollbar {
            width: 8px;
        }
        .ai-body::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 10px;
        }
        .ai-welcome {
            text-align: center;
            padding: 20px;
        }
        .ai-welcome-icon {
            font-size: 40px;
            margin-bottom: 10px;
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .ai-welcome-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .ai-welcome-subtitle {
            font-size: 14px;
            color: #666;
        }
        .ai-message {
            padding: 12px 16px;
            border-radius: 15px;
            margin-bottom: 12px;
            font-size: 14px;
            line-height: 1.7;
            animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ai-message.user {
            background: #e3f2fd;
            color: #1565c0;
            border: 2px solid #2196f3;
            text-align: right;
            margin-left: 40px;
        }
        .ai-message.bot {
            background: #e8f5e9;
            color: #2e7d32;
            border: 2px solid #4caf50;
            text-align: right;
            margin-right: 40px;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .ai-message.search-result {
            background: #e3f2fd;
            color: #1a237e;
            border: 2px solid #42a5f5;
            text-align: right;
            margin-right: 20px;
            margin-left: 20px;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 13px;
            max-height: 350px;
            overflow-y: auto;
        }
        .ai-message.error {
            background: #ffebee;
            color: #c62828;
            border: 2px solid #ef5350;
            text-align: right;
            margin-right: 40px;
        }
        .ai-action-button {
            width: 100%;
            padding: 12px;
            margin-top: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        .ai-action-button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .ai-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
        }
        .ai-suggestion-chip {
            background: white;
            border: 2px solid #667eea;
            color: #667eea;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
        }
        .ai-suggestion-chip:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }
        .ai-input-container {
            display: flex;
            gap: 10px;
            padding: 15px 20px;
            border-top: 2px solid #e0e0e0;
            background: white;
        }
        .ai-text-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #ddd;
            border-radius: 12px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            outline: none;
            transition: all 0.3s;
        }
        .ai-text-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
        }
        .ai-input-btn {
            padding: 12px 16px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s;
            background: #667eea;
            color: white;
        }
        .ai-input-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .ai-mic-btn {
            background: #f093fb;
        }
        .ai-mic-btn:hover {
            background: #e879f9;
        }
        .ai-mic-btn.active {
            background: #f5576c;
            animation: aiPulse 1s infinite;
        }
        .ai-send-btn {
            background: #667eea;
        }
        .ai-send-btn:hover {
            background: #5a67d8;
        }
        .ai-stop-btn {
            background: #dc3545;
        }
        .ai-stop-btn:hover {
            background: #c82333;
        }
        .ai-stop-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            opacity: 0.8;
            color: #fff;
            transform: scale(0.95);
            border: 2px solid #495057;
        }
        .ai-stop-btn:not(:disabled) {
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @media print {
            #aiAssistantBtn, #aiAssistantPanel {
                display: none !important;
            }
        }
        @media (max-width: 480px) {
            #aiAssistantPanel {
                width: calc(100vw - 40px);
                right: 20px;
                bottom: 100px;
            }
            #aiAssistantBtn {
                width: 60px;
                height: 60px;
                font-size: 30px;
                right: 20px;
                bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('div');
    btn.id = 'aiAssistantBtn';
    btn.innerHTML = '🤖';
    btn.title = 'المساعد الذكي - اضغط للمساعدة';

    const panel = document.createElement('div');
    panel.id = 'aiAssistantPanel';
    panel.innerHTML = `
        <div class="ai-header">
            <div class="ai-header-title">
                <span>🤖</span>
                <span>المساعد الذكي</span>
            </div>
            <div class="ai-header-controls">
                <div class="ai-header-btn" id="aiHeaderMicBtn" title="تحدث بالميكروفون">🎤</div>
                <div class="ai-header-btn" id="aiMinimizeBtn" title="تصغير">−</div>
                <div class="ai-header-btn" id="aiCloseBtn" title="إغلاق">×</div>
            </div>
        </div>
        <div class="ai-body" id="aiChatBody">
            <div class="ai-welcome">
                <div class="ai-welcome-icon">🤖</div>
                <div class="ai-welcome-title">مرحباً! أنا مساعدك الذكي</div>
                <div class="ai-welcome-subtitle">اسألني بالصوت أو الكتابة عن أي شيء</div>
            </div>
            <div class="ai-suggestions">
                <div class="ai-suggestion-chip" onclick="AIUI.promptSearch()">🔍 بحث عن منتج</div>
                <div class="ai-suggestion-chip" onclick="AIUI.promptPharmacySearch()">🏥 بحث عن صيدلية</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('كام منتج في المخزن؟')">📊 إحصائيات المخزن</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('إزاي أسجل مخزن؟')">تسجيل مخزن</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('كيف أضيف صيدلية؟')">إضافة صيدلية</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('كيف أرفع منتجات كتير؟')">رفع منتجات</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('إزاي أعمل أوردر؟')">عمل أوردر</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('كيف أحذف منتج؟')">حذف منتج</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('مشكلة في الطباعة')">مشكلة طباعة</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('كيف أضيف موظف؟')">إضافة موظف</div>
                <div class="ai-suggestion-chip" onclick="AIUI.askQuestion('تنبيه نفاذ الكمية')">تنبيه الكمية</div>
            </div>
        </div>
        <div class="ai-input-container">
            <input type="text" class="ai-text-input" id="aiTextInput" placeholder="اكتب سؤالك هنا..." dir="rtl">
            <button class="ai-input-btn ai-stop-btn" id="aiStopBtn" title="إيقاف الصوت (متاح عند الكلام)" disabled>⏹️</button>
            <button class="ai-input-btn ai-mic-btn" id="aiMicBtn" title="تحدث بالميكروفون">🎤</button>
            <button class="ai-input-btn ai-send-btn" id="aiSendBtn" title="إرسال">➤</button>
        </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    window.AIUI = {
        isOpen: false,

        toggle: function() {
            this.isOpen = !this.isOpen;
            panel.classList.toggle('open', this.isOpen);
            
            // تحديث موقع البانل إذا كان مدمجاً (Anchored)
            if (this.isOpen && panel.classList.contains('anchored')) {
                panel.style.top = (btn.offsetTop + btn.offsetHeight + 10) + 'px';
            }
        },

        open: function() {
            this.isOpen = true;
            panel.classList.add('open');
        },

        close: function() {
            this.isOpen = false;
            panel.classList.remove('open');
            panel.classList.remove('active-interaction');
        },

        minimize: function() {
            panel.classList.toggle('minimized');
            const isMinimized = panel.classList.contains('minimized');
            document.getElementById('aiMinimizeBtn').textContent = isMinimized ? '➕' : '−';
            document.getElementById('aiMinimizeBtn').title = isMinimized ? 'تكبير' : 'تصغير';
        },

        addMessage: function(text, type, isHtml = false) {
            const chatBody = document.getElementById('aiChatBody');
            const message = document.createElement('div');
            message.className = 'ai-message ' + type;
            if (isHtml) {
                message.innerHTML = text;
            } else {
                message.textContent = text;
            }
            chatBody.appendChild(message);
            chatBody.scrollTop = chatBody.scrollHeight;
            return message;
        },

        promptSearch: function() {
            this.open();
            this.askQuestion('ابحث عن منتج');
            const input = document.getElementById('aiTextInput');
            input.value = 'ابحث عن ';
            input.focus();
            // وضع المؤشر في نهاية النص
            const len = input.value.length;
            input.setSelectionRange(len, len);
        },

        promptPharmacySearch: function() {
            this.open();
            this.askQuestion('ابحث عن صيدلية');
            const input = document.getElementById('aiTextInput');
            input.value = 'صيدلية ';
            input.focus();
            const len = input.value.length;
            input.setSelectionRange(len, len);
        },

        askQuestion: function(question) {
            if (!question || !question.trim()) return;

            this.addMessage(question, 'user');

            if (window.AICore) {
                const match = window.AICore.findAnswer(question);
                
                if (match) {
                    // تحديد نوع الرسالة حسب نوع النتيجة
                    const msgType = match.isSearch ? 'search-result' : 'bot';
                    const botMsg = this.addMessage(match.answer, msgType, match.isHtml);
                    
                    if (match.action) {
                        const actionBtn = document.createElement('button');
                        actionBtn.className = 'ai-action-button';
                        actionBtn.textContent = match.actionText || (match.isSearch 
                            ? '📋 فتح الصفحة لعرض التفاصيل' 
                            : '⚡ تنفيذ الإجراء مباشرة');
                        actionBtn.onclick = () => {
                            this.close();
                            setTimeout(match.action, 200);
                        };
                        botMsg.appendChild(document.createElement('br'));
                        botMsg.appendChild(actionBtn);
                        
                        // تنفيذ الإجراء فوراً إذا كان مدعوماً (لعمليات الإضافة السريعة)
                        if (match.immediateAction) {
                            console.log('🚀 AI: Executing immediate action...');
                            setTimeout(() => {
                                const success = match.immediateAction();
                                if (success) {
                                    actionBtn.textContent = '✅ تمت العملية بنجاح';
                                    actionBtn.style.background = '#28a745';
                                    actionBtn.disabled = true;
                                }
                            }, 500);
                        }
                    }

                    // لا ننطق نتائج البحث الطويلة
                    if (window.AISpeech && !match.isSearch) {
                        console.log('🔊 AI: Starting speech for answer');
                        const stopBtn = document.getElementById('aiStopBtn');
                        if (stopBtn) {
                            stopBtn.disabled = false;
                            console.log('🔊 AI: Stop button enabled');
                            // إضافة تنبيه بصري
                            stopBtn.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.5)';
                            setTimeout(() => {
                                stopBtn.style.boxShadow = '';
                            }, 2000);
                        } else {
                            console.log('🔊 AI: Stop button not found');
                        }
                        
                        window.AISpeech.speak(match.answer, () => {
                            btn.classList.remove('speaking');
                            if (stopBtn) {
                                stopBtn.disabled = true;
                                stopBtn.style.boxShadow = '';
                                console.log('🔊 AI: Stop button disabled after speech');
                            }
                        });
                        btn.classList.add('speaking');
                    } else if (match.isSearch && window.AISpeech) {
                        // نطق ملخص قصير فقط لنتائج البحث
                        const summary = match.voiceSummary || (match.searchType === 'product' 
                            ? 'تم العثور على نتائج البحث في المنتجات' 
                            : 'تم العثور على نتائج البحث في الصيدليات');
                        window.AISpeech.speak(summary, () => {
                            btn.classList.remove('speaking');
                        });
                        btn.classList.add('speaking');
                    }

                    if (window.AIValidation) {
                        window.AIValidation.beep('success');
                        const toast = match.isSearch 
                            ? '🔍 تم البحث بنجاح' 
                            : '✅ تم العثور على الإجابة';
                        window.AIValidation.showToast(toast, 'success');
                    }
                } else {
                    const fallback = 'عذراً، لم أفهم سؤالك. جرب أن تسأل عن: التسجيل، إضافة منتج، صيدلية، أوردر، موظف، دليفري، طباعة.\n\n💡 أو ابحث عن منتج بكتابة:\n"ابحث عن [اسم المنتج]"';
                    this.addMessage(fallback, 'error');

                    if (window.AISpeech) {
                        console.log('🔊 AI: Starting error speech');
                        const stopBtn = document.getElementById('aiStopBtn');
                        if (stopBtn) {
                            stopBtn.disabled = false;
                            console.log('🔊 AI: Stop button enabled for error');
                        }
                        
                        window.AISpeech.speak('عذراً لم أفهم سؤالك. جرب البحث عن منتج أو اسأل عن موضوع محدد.', () => {
                            if (stopBtn) {
                                stopBtn.disabled = true;
                                console.log('🔊 AI: Stop button disabled after error speech');
                            }
                        });
                    }

                    if (window.AIValidation) {
                        window.AIValidation.beep('error');
                        window.AIValidation.showToast('❌ لم يتم فهم السؤال', 'error');
                    }
                }
            }

            document.getElementById('aiTextInput').value = '';
        },

        stopSpeaking: function() {
            console.log('⏹️ AI: Stop speaking called');
            
            // إيقاف الصوت
            if (window.speechSynthesis) {
                console.log('⏹️ AI: Cancelling speech synthesis');
                window.speechSynthesis.cancel();
            } else {
                console.log('⏹️ AI: speechSynthesis not available');
            }
            
            // إزالة حالة التحدث
            btn.classList.remove('speaking');
            
            // تعطيل زر الإيقاف
            const stopBtn = document.getElementById('aiStopBtn');
            if (stopBtn) {
                stopBtn.disabled = true;
                stopBtn.style.boxShadow = '';
                console.log('⏹️ AI: Stop button disabled');
            } else {
                console.log('⏹️ AI: Stop button not found');
            }
            
            // إيقاف AISpeech
            if (window.AISpeech && window.AISpeech.stopSpeaking) {
                console.log('⏹️ AI: Stopping AISpeech');
                window.AISpeech.stopSpeaking();
            } else {
                console.log('⏹️ AI: AISpeech not available');
            }
        },

        startListening: function() {
            if (!window.AISpeech) return;

            const micBtn = document.getElementById('aiMicBtn');
            const headerMicBtn = document.getElementById('aiHeaderMicBtn');
            
            window.AISpeech.startListening(
                (transcript) => {
                    micBtn.classList.remove('active');
                    headerMicBtn.classList.remove('active-mic');
                    btn.classList.remove('listening');
                    
                    document.getElementById('aiTextInput').value = transcript;
                    this.askQuestion(transcript);
                },
                (error) => {
                    micBtn.classList.remove('active');
                    headerMicBtn.classList.remove('active-mic');
                    btn.classList.remove('listening');
                    
                    const errorMessages = {
                        'no-speech': 'لم أسمع شيئاً، حاول مرة أخرى',
                        'not-allowed': 'يجب السماح بالميكروفون أولاً',
                        'not-supported': 'المتصفح لا يدعم التعرف الصوتي',
                        'network': 'خطأ في الاتصال بالإنترنت'
                    };
                    
                    const message = errorMessages[error] || 'خطأ في الميكروفون';
                    
                    if (window.AIValidation) {
                        window.AIValidation.showToast('❌ ' + message, 'error');
                        window.AIValidation.speak('عفواً، ' + message);
                    }
                }
            );

            if (window.AISpeech.isListening) {
                micBtn.classList.add('active');
                if (headerMicBtn) headerMicBtn.classList.add('active-mic');
                btn.classList.add('listening');
                if (!this.isOpen) this.open();
            }
        }
    };

    // تفعيل خاصية السحب (Drag and Drop)
    function enableDragging(header, target) {
        let isDragging = false;
        let startX, startY;
        let initialTop, initialRight;

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            // نفضل السحب من خلال الهيدر فقط
            if (e.target.closest('.ai-header-close')) return;
            
            isDragging = true;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            
            startX = clientX;
            startY = clientY;
            
            const rect = target.getBoundingClientRect();
            initialTop = rect.top;
            initialRight = window.innerWidth - rect.right;
            
            // إيقاف أي أحداث أخرى قد تتعارض
            if (e.type === 'touchstart') e.preventDefault();
            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        }

        function onDrag(e) {
            if (!isDragging) return;
            
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            // حساب الموقع الجديد
            let newTop = initialTop + deltaY;
            let newRight = initialRight - deltaX;
            
            // حدود الشاشة
            const panelWidth = target.offsetWidth;
            const panelHeight = target.offsetHeight;
            
            newTop = Math.max(10, Math.min(window.innerHeight - panelHeight - 10, newTop));
            newRight = Math.max(10, Math.min(window.innerWidth - panelWidth - 10, newRight));
            
            target.style.top = newTop + 'px';
            target.style.right = newRight + 'px';
            target.style.bottom = 'auto'; // مهم لإلغاء التنسيق الافتراضي
            
            if (e.type === 'touchmove') e.preventDefault();
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    }

    // تفعيل السحب للوحة المساعد
    const aiHeader = document.querySelector('.ai-header');
    enableDragging(aiHeader, panel);

    // فحص إذا كان هناك حاوية ثابتة للمساعد في ترويسة الصفحة
    const staticContainer = document.getElementById('aiAssistantStaticContainer');
    if (staticContainer) {
        console.log('🤖 AI: Anchoring to static container...');
        staticContainer.appendChild(btn);
        staticContainer.appendChild(panel);
        
        btn.style.position = 'static';
        btn.style.margin = '0';
        panel.classList.add('anchored');
        
        // إيقاف خاصية السحب في الوضع الثابت (اختياري، لنفعلها فقط للهيدر)
        // aiHeader.style.cursor = 'default';
    }

    // إضافة مستمعات الأحداث (التي تم حذفها بالخطأ)
    btn.addEventListener('click', () => AIUI.toggle());
    document.getElementById('aiCloseBtn').addEventListener('click', () => AIUI.close());
    document.getElementById('aiHeaderMicBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        AIUI.startListening();
    });
    document.getElementById('aiMinimizeBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        AIUI.minimize();
    });

    // تفاعل الشفافية عند التركيز (تم تعطيله بناءً على طلب العميل)
    // const aiTextInputArea = document.getElementById('aiTextInput');
    // aiTextInputArea.addEventListener('focus', () => panel.classList.add('active-interaction'));
    // aiTextInputArea.addEventListener('blur', () => panel.classList.remove('active-interaction'));

    document.getElementById('aiSendBtn').addEventListener('click', () => {
        const input = document.getElementById('aiTextInput');
        AIUI.askQuestion(input.value);
    });
    document.getElementById('aiTextInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            AIUI.askQuestion(e.target.value);
        }
    });
    document.getElementById('aiMicBtn').addEventListener('click', () => AIUI.startListening());
    document.getElementById('aiStopBtn').addEventListener('click', (e) => {
        const btn = document.getElementById('aiStopBtn');
        if (btn.disabled) {
            console.log('⏹️ AI: Stop button clicked but disabled');
            e.preventDefault();
            return;
        }
        AIUI.stopSpeaking();
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            AIUI.toggle();
        }
    });

    console.log('✅ AI UI loaded and repositioned to top-right with draggable feature');
    
    // فحص زر التوقف
    setTimeout(() => {
        const stopBtn = document.getElementById('aiStopBtn');
        if (stopBtn) {
            console.log('✅ AI: Stop button found and ready');
        } else {
            console.log('❌ AI: Stop button not found');
        }
    }, 1000);

    // --- نظام المساعد الاستباقي (Proactive Assistant) ---
    
    // 1. التنشيط التلقائي عند فتح صفحات معينة
    setTimeout(() => {
        if (window.AICore) {
            const pageAdvice = window.AICore.getProactiveAdvice(window.location.pathname);
            if (pageAdvice) {
                AIUI.open();
                AIUI.addMessage(pageAdvice.answer, 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak(pageAdvice.voice);
                }
            }
        }
    }, 1500); // تأخير بسيط ليظهر المساعد بعد تحميل الصفحة

    // 2. مراقبة المدخلات (Real-time Input Monitoring)
    let monitorTimer = null;
    const monitorInputs = () => {
        if (monitorTimer) clearTimeout(monitorTimer);
        monitorTimer = setTimeout(() => {
            if (!window.AICore) return;

            // جمع بيانات الحقول الحالية من الصفحة (يدعم أسماء الحقول الشائعة)
            const fields = {
                price: document.getElementById('price')?.value || document.getElementById('prodPrice')?.value,
                expiryMonth: document.getElementById('expiryMonth')?.value || document.getElementById('expMonth')?.value,
                expiryYear: document.getElementById('expiryYear')?.value || document.getElementById('expYear')?.value,
                productName: document.getElementById('productName')?.value || document.getElementById('prodName')?.value,
                quantity: document.getElementById('quantity')?.value || document.getElementById('prodQuantity')?.value,
                discount: document.getElementById('discount')?.value || document.getElementById('prodDiscount')?.value,
                barcode: document.getElementById('barcode')?.value || document.getElementById('prodBarcode')?.value,
                productionDate: document.getElementById('productionDate')?.value || document.getElementById('prodDate')?.value
            };

            const warnings = window.AICore.validatePageInputs(fields);
            
            // عرض أول تحذير مكتشف (لتجنب الإزعاج)
            if (warnings.length > 0) {
                const warn = warnings[0];
                // تجنب تكرار نفس التحذير
                if (window._lastWarning !== warn.message) {
                    AIUI.open();
                    AIUI.addMessage(warn.message, 'bot', true);
                    if (window.AISpeech) window.AISpeech.speak(warn.voice);
                    window._lastWarning = warn.message;
                }
            }
        }, 1500); // Debounce
    };

    // إضافة مستمعات للأحداث في الصفحة بالكامل
    const monitoredFields = [
        'price', 'prodPrice', 'expiryMonth', 'expMonth', 'expiryYear', 'expYear',
        'productName', 'prodName', 'quantity', 'prodQuantity', 
        'discount', 'prodDiscount', 'barcode', 'prodBarcode',
        'productionDate', 'prodDate', 'productionDateManual', 'expiryDateManual',
        'priceInt', 'priceFrac', 'prodDay', 'prodMonth', 'prodYear',
        'expDay', 'expMonth', 'expYear'
    ];

    // مستمع لأحداث الإدخال والتغيير
    document.addEventListener('input', (e) => {
        const targetId = e.target.id;
        if (monitoredFields.includes(targetId) || isBulkField(targetId)) {
            monitorInputs();
            
            // التحقق إذا كنا في صفحة إضافة منتج - إذا كانت كذلك، لا تقرأ البيانات
            const isAddProductPage = window.location.pathname.includes('add-product') || 
                                 window.location.href.includes('add-product');
            
            if (!isAddProductPage) {
                // قراءة البيانات المدخلة بصوت (في الصفحات الأخرى فقط)
                readInputData(targetId, e.target.value);
            }
        }
    });

    document.addEventListener('change', (e) => {
        const targetId = e.target.id;
        if (monitoredFields.includes(targetId) || isBulkField(targetId)) {
            monitorInputs();
            
            // التحقق إذا كنا في صفحة إضافة منتج - إذا كانت كذلك، لا تقرأ البيانات
            const isAddProductPage = window.location.pathname.includes('add-product') || 
                                 window.location.href.includes('add-product');
            
            if (!isAddProductPage) {
                // قراءة البيانات المدخلة بصوت (في الصفحات الأخرى فقط)
                readInputData(targetId, e.target.value);
            }
        }
    });

    // دالة للتحقق من حقول الإدخال الجماعي
    function isBulkField(fieldId) {
        // التحقق من المعرفات الديناميكية مثل productName_1, price_2, etc.
        const bulkFieldPattern = /^(productName|price|quantity|discount|barcode|expiryMonth|expiryYear)_\d+$/;
        return bulkFieldPattern.test(fieldId);
    }

    // دالة للحصول على نوع الحقل من المعرف الديناميكي
    function getBulkFieldType(fieldId) {
        const match = fieldId.match(/^(productName|price|quantity|discount|barcode|expiryMonth|expiryYear)_\d+$/);
        return match ? match[1] : null;
    }

    // دالة لقراءة البيانات المدخلة بصوت
    function readInputData(fieldId, value) {
        if (!window.AISpeech || !value || value.trim() === '') return;
        
        let fieldName = getFieldNameArabic(fieldId);
        
        // إذا كان حقلاً ديناميكياً، استخرج اسم الحقل الأساسي
        if (!fieldName && isBulkField(fieldId)) {
            const fieldType = getBulkFieldType(fieldId);
            fieldName = getFieldNameArabic(fieldType);
        }
        
        if (!fieldName) return;
        
        let message = '';
        
        // تحضير الرسالة الصوتية حسب نوع الحقل
        const fieldType = isBulkField(fieldId) ? getBulkFieldType(fieldId) : fieldId;
        
        switch(fieldType) {
            case 'productName':
            case 'prodName':
                message = `اسم المنتج: ${value}`;
                break;
            case 'price':
            case 'prodPrice':
                const price = parseFloat(value);
                if (!isNaN(price)) {
                    message = `السعر: ${price} جنيه`;
                }
                break;
            case 'priceInt':
                const priceInt = parseInt(value);
                if (!isNaN(priceInt)) {
                    message = `الرقم الصحيح للسعر: ${priceInt}`;
                }
                break;
            case 'priceFrac':
                const priceFrac = parseInt(value);
                if (!isNaN(priceFrac)) {
                    message = `الجزء العشري للسعر: ${priceFrac}`;
                }
                break;
            case 'quantity':
            case 'prodQuantity':
                const qty = parseInt(value);
                if (!isNaN(qty)) {
                    message = `الكمية: ${qty} قطعة`;
                }
                break;
            case 'discount':
            case 'prodDiscount':
                const discount = parseFloat(value);
                if (!isNaN(discount)) {
                    message = `الخصم: ${discount} بالمئة`;
                }
                break;
            case 'barcode':
            case 'prodBarcode':
                message = `الباركود: ${value}`;
                break;
            case 'expiryMonth':
            case 'expMonth':
                const months = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                const monthIndex = parseInt(value);
                if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
                    message = `شهر الانتهاء: ${months[monthIndex]}`;
                }
                break;
            case 'expiryYear':
            case 'expYear':
                const year = parseInt(value);
                if (!isNaN(year) && year >= 2024 && year <= 2030) {
                    message = `سنة الانتهاء: ${year}`;
                }
                break;
            case 'productionDate':
            case 'prodDate':
                if (value && value.includes('-')) {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        const formattedDate = date.toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        message = `تاريخ الإنتاج: ${formattedDate}`;
                    }
                }
                break;
        }
        
        if (message) {
            // إلغاء أي قراءة صوتية سابقة وبدء القراءة الجديدة
            window.AISpeech.stopSpeaking();
            
            // تأخير بسيط قبل القراءة لتجنب التداخل
            setTimeout(() => {
                window.AISpeech.speak(message, () => {
                    console.log(`🗣️ تم قراءة البيانات: ${message}`);
                });
            }, 300);
        }
    }

    // مستمع لأحداث النقر والتركيز (لتفعيل المساعد عند النقر على الحقول)
    document.addEventListener('focus', (e) => {
        const targetId = e.target.id;
        if (monitoredFields.includes(targetId) || isBulkField(targetId)) {
            // تم إلغاء توجيه المساعد الذكي في الحقول
            monitorInputs();
        }
    }, true); // Use capture to ensure it works for all fields

    document.addEventListener('click', (e) => {
        const targetId = e.target.id;
        if (monitoredFields.includes(targetId) || isBulkField(targetId)) {
            // تم إلغاء توجيه المساعد الذكي في الحقول
            monitorInputs();
        }
    });

    // دالة للحصول على الاسم العربي للحقل
    function getFieldNameArabic(fieldId) {
        const fieldNames = {
            'productName': 'اسم المنتج',
            'prodName': 'اسم المنتج',
            'price': 'السعر',
            'prodPrice': 'السعر',
            'priceInt': 'الرقم الصحيح للسعر',
            'priceFrac': 'الجزء العشري للسعر',
            'quantity': 'الكمية',
            'prodQuantity': 'الكمية',
            'discount': 'الخصم',
            'prodDiscount': 'الخصم',
            'barcode': 'الباركود',
            'prodBarcode': 'الباركود',
            'expiryMonth': 'شهر الانتهاء',
            'expMonth': 'شهر الانتهاء',
            'expiryYear': 'سنة الانتهاء',
            'expYear': 'سنة الانتهاء',
            'productionDate': 'تاريخ الإنتاج',
            'prodDate': 'تاريخ الإنتاج',
            'prodDay': 'يوم الإنتاج',
            'prodMonth': 'شهر الإنتاج',
            'prodYear': 'سنة الإنتاج',
            'expDay': 'يوم انتهاء الصلاحية',
            'expMonth': 'شهر انتهاء الصلاحية',
            'expYear': 'سنة انتهاء الصلاحية'
        };
        return fieldNames[fieldId] || null;
    }

    // دالة للحصول على رسالة التركيز المخصصة لكل حقل
    function getFieldFocusMessage(fieldId) {
        const focusMessages = {
            'productName': 'ادخل اسم المنتج',
            'prodName': 'ادخل اسم المنتج',
            'price': 'ادخل سعر المنتج',
            'prodPrice': 'ادخل سعر المنتج',
            'priceInt': 'ادخل الرقم الصحيح للسعر، مثل: واحد، اثنان، مية، مئتين',
            'priceFrac': 'ادخل الجزء العشري للسعر، مثل: خمسين، سبعين، تسعين',
            'quantity': 'ادخل كمية المنتج',
            'prodQuantity': 'ادخل كمية المنتج',
            'discount': 'ادخل نسبة الخصم',
            'prodDiscount': 'ادخل نسبة الخصم',
            'barcode': 'ادخل باركود المنتج',
            'prodBarcode': 'ادخل باركود المنتج',
            'expiryMonth': 'اختر شهر انتهاء الصلاحية',
            'expMonth': 'اختر شهر انتهاء الصلاحية',
            'expiryYear': 'اختر سنة انتهاء الصلاحية',
            'expYear': 'اختر سنة انتهاء الصلاحية',
            'productionDate': 'اختر تاريخ الإنتاج، ادخل اليوم والشهر والسنة',
            'prodDate': 'اختر تاريخ الإنتاج، ادخل اليوم والشهر والسنة',
            'productionDateManual': 'اختر تاريخ الإنتاج، ادخل اليوم والشهر والسنة',
            'expiryDateManual': 'اختر تاريخ الانتهاء، ادخل اليوم والشهر والسنة',
            'prodDay': 'ادخل يوم الإنتاج، قل رقماً من واحد إلى واحد وتلاتين',
            'prodMonth': 'ادخل شهر الإنتاج، قل رقماً من واحد إلى اثنا عشر',
            'prodYear': 'ادخل سنة الإنتاج، قل سنة مثل ألفين وخمسة وعشرين',
            'expDay': 'ادخل يوم انتهاء الصلاحية، قل رقماً من واحد إلى واحد وتلاتين',
            'expMonth': 'ادخل شهر انتهاء الصلاحية، قل رقماً من واحد إلى اثنا عشر',
            'expYear': 'ادخل سنة انتهاء الصلاحية، قل سنة مثل ألفين وخمسة وعشرين'
        };
        return focusMessages[fieldId] || null;
    }

    // دالة للحصول على رسالة النقر المخصصة لكل حقل
    function getFieldClickMessage(fieldId) {
        const clickMessages = {
            'productName': 'ادخل اسم المنتج',
            'prodName': 'ادخل اسم المنتج',
            'price': 'ادخل سعر المنتج',
            'prodPrice': 'ادخل سعر المنتج',
            'priceInt': 'قل الرقم الصحيح للسعر بالعربية، مثل: واحد، اثنان، مية، مئتين، أو اضغط على الميكروفون',
            'priceFrac': 'قل الجزء العشري للسعر بالعربية، مثل: خمسين، سبعين، تسعين، أو اضغط على الميكروفون',
            'quantity': 'ادخل كمية المنتج',
            'prodQuantity': 'ادخل كمية المنتج',
            'discount': 'ادخل نسبة الخصم',
            'prodDiscount': 'ادخل نسبة الخصم',
            'barcode': 'ادخل باركود المنتج',
            'prodBarcode': 'ادخل باركود المنتج',
            'expiryMonth': 'اختر شهر انتهاء الصلاحية',
            'expMonth': 'اختر شهر انتهاء الصلاحية',
            'expiryYear': 'اختر سنة انتهاء الصلاحية',
            'expYear': 'اختر سنة انتهاء الصلاحية',
            'productionDate': 'اختر تاريخ الإنتاج، ادخل اليوم والشهر والسنة',
            'prodDate': 'اختر تاريخ الإنتاج، ادخل اليوم والشهر والسنة',
            'productionDateManual': 'اختر تاريخ الإنتاج، ادخل اليوم والشهر والسنة',
            'expiryDateManual': 'اختر تاريخ الانتهاء، ادخل اليوم والشهر والسنة',
            'prodDay': 'قل يوم الإنتاج بالعربية، مثل: خمسة، عشرة، خمسة عشر، أو اضغط على الميكروفون',
            'prodMonth': 'قل شهر الإنتاج بالعربية، مثل: واحد، تلاتة، سبعة، أو اضغط على الميكروفون',
            'prodYear': 'قل سنة الإنتاج بالعربية، مثل: ألفين وخمسة وعشرين، أو اضغط على الميكروفون',
            'expDay': 'قل يوم انتهاء الصلاحية بالعربية، مثل: خمسة، عشرة، خمسة عشر، أو اضغط على الميكروفون',
            'expMonth': 'قل شهر انتهاء الصلاحية بالعربية، مثل: واحد، تلاتة، سبعة، أو اضغط على الميكروفون',
            'expYear': 'قل سنة انتهاء الصلاحية بالعربية، مثل: ألفين وخمسة وعشرين، أو اضغط على الميكروفون'
        };
        return clickMessages[fieldId] || getFieldFocusMessage(fieldId);
    }

    // 4. فتح تلقائي عند تحميل الصفحة (Auto-open on page load)
    const checkPageAndOpenAssistant = () => {
        if (!window.AIUI || !window.AICore) return;
        
        const currentPath = window.location.pathname.toLowerCase();
        const currentHref = window.location.href.toLowerCase();
        
        // فتح تلقائي في صفحات الإدخال الجماعي
        if (currentPath.includes('bulk-add') || currentPath.includes('bulk-add-products') || 
            currentPath.includes('bulk-entry') || currentPath.includes('mass-add') ||
            currentHref.includes('bulk-add') || currentHref.includes('bulk-add-products') ||
            currentHref.includes('bulk-entry') || currentHref.includes('mass-add')) {
            
            // فتح المساعد بعد تأخير بسيط لضمان تحميل الصفحة بالكامل
            setTimeout(() => {
                if (!AIUI.isOpen) {
                    AIUI.open();
                    
                    // إرسال رسالة ترحيبية للصفحة
                    const welcomeMessage = window.AICore.getProactiveAdvice('bulk-add');
                    if (welcomeMessage) {
                        AIUI.addMessage(welcomeMessage.answer, 'bot', true);
                        if (window.AISpeech) {
                            window.AISpeech.speak(welcomeMessage.voice);
                        }
                    } else {
                        // رسالة افتراضية إذا لم تكن هناك رسالة مخصصة
                        const defaultMessage = "👋 <strong>أهلاً بك!</strong> شايف إنك في صفحة الإدخال الجماعي للمنتجات. أنا هنا لمساعدتك في إدخال البيانات بشكل صحيح وسريع.";
                        AIUI.addMessage(defaultMessage, 'bot', true);
                        if (window.AISpeech) {
                            window.AISpeech.speak("أهلاً بك في صفحة الإدخال الجماعي للمنتجات، أنا هنا لمساعدتك");
                        }
                    }
                    
                    console.log('✅ تم فتح المساعد تلقائياً في صفحة الإدخال الجماعي');
                }
            }, 2000); // تأخير 2 ثانية لضمان تحميل الصفحة
        }
        
        // فتح تلقائي في صفحات إضافة منتج فردية
        if (currentPath.includes('add-product') || currentPath.includes('new-product') ||
            currentHref.includes('add-product') || currentHref.includes('new-product')) {
            
            setTimeout(() => {
                if (!AIUI.isOpen) {
                    AIUI.open();
                    
                    const welcomeMessage = window.AICore.getProactiveAdvice('add-product');
                    if (welcomeMessage) {
                        AIUI.addMessage(welcomeMessage.answer, 'bot', true);
                        if (window.AISpeech) {
                            window.AISpeech.speak(welcomeMessage.voice);
                        }
                    }
                    
                    console.log('✅ تم فتح المساعد تلقائياً في صفحة إضافة منتج');
                }
            }, 1500);
        }
    };

    // تشغيل الفحص عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', checkPageAndOpenAssistant);
    
    // تشغيل الفحص أيضاً بعد تحميل الصفحة (لصفحات الـ SPA)
    window.addEventListener('load', checkPageAndOpenAssistant);

    // إضافة زر نسخ البيانات
    const addCopyButton = () => {
        // التحقق من وجود الزر بالفعل
        if (document.getElementById('copyDataBtn')) return;
        
        const panel = document.getElementById('aiPanel');
        if (!panel) return;
        
        // إنشاء زر نسخ البيانات
        const copyButton = document.createElement('button');
        copyButton.id = 'copyDataBtn';
        copyButton.innerHTML = '📋 نسخ البيانات';
        copyButton.style.cssText = `
            background: #ffc107;
            color: #000;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin: 5px;
            transition: background 0.3s;
        `;
        copyButton.title = 'نسخ بيانات المنتجات من الجدول';
        
        copyButton.onmouseover = () => copyButton.style.background = '#e0a800';
        copyButton.onmouseout = () => copyButton.style.background = '#ffc107';
        
        copyButton.onclick = () => {
            copyTableData();
            
            // إشعار في المساعد
            if (window.AIUI) {
                window.AIUI.addMessage('✅ تم نسخ بيانات الجدول إلى الحافظة!', 'bot', true);
                if (window.AISpeech) {
                    window.AISpeech.speak('تم نسخ البيانات بنجاح');
                }
            }
        };
        
        // إضافة الزر إلى رأس لوحة المساعد
        const header = panel.querySelector('.ai-panel-header');
        if (header) {
            header.appendChild(copyButton);
        }
    };

    // إضافة زر اختيار الملف
    const addFileButton = () => {
        // التحقق من وجود الزر بالفعل
        if (document.getElementById('fileSelectBtn')) return;
        
        const panel = document.getElementById('aiPanel');
        if (!panel) return;
        
        // إنشاء زر اختيار الملف
        const fileButton = document.createElement('button');
        fileButton.id = 'fileSelectBtn';
        fileButton.innerHTML = '📁 اختيار ملف';
        fileButton.style.cssText = `
            background: #28a745;
            color: #fff;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin: 5px;
            transition: background 0.3s;
        `;
        fileButton.title = 'استيراد بيانات المنتجات من ملف';
        
        fileButton.onmouseover = () => fileButton.style.background = '#218838';
        fileButton.onmouseout = () => fileButton.style.background = '#28a745';
        
        fileButton.onclick = () => {
            // التحقق من وجود دالة اختيار الملف
            if (typeof handleFileSelect === 'function') {
                // محاكاة النقر على زر اختيار الملف في الصفحة
                const fileInput = document.getElementById('fileInput');
                if (fileInput) {
                    fileInput.click();
                    
                    // إشعار في المساعد
                    if (window.AIUI) {
                        window.AIUI.addMessage('📁 تم فتح نافذة اختيار الملفات<br>اختر ملف Excel أو CSV أو TXT لاستيراد البيانات', 'bot', true);
                        if (window.AISpeech) {
                            window.AISpeech.speak('اختر ملف لاستيراد البيانات');
                        }
                    }
                } else {
                    // إذا لم يكن هناك مدخل ملف، نطلب من المستخدم الانتقال للصفحة
                    if (window.AIUI) {
                        window.AIUI.addMessage('📁 <strong>لاستيراد الملفات:</strong><br>1. اذهب إلى صفحة الإدخال الجماعي<br>2. استخدم زر "📁 اختر ملف" هناك<br>3. أو انسخ البيانات والصقها هنا', 'bot', true);
                        if (window.AISpeech) {
                            window.AISpeech.speak('اذهب إلى صفحة الإدخال الجماعي لاختيار الملف');
                        }
                    }
                }
            } else {
                // إذا لم تكن الدالة متاحة
                if (window.AIUI) {
                    window.AIUI.addMessage('❌ وظيفة استيراد الملفات غير متاحة في هذه الصفحة<br>يرجى الانتقال إلى صفحة الإدخال الجماعي', 'bot', true);
                    if (window.AISpeech) {
                        window.AISpeech.speak('اذهب إلى صفحة الإدخال الجماعي');
                    }
                }
            }
        };
        
        // إضافة الزر إلى رأس لوحة المساعد
        const header = panel.querySelector('.ai-panel-header');
        if (header) {
            header.appendChild(fileButton);
        }
    };

    // إضافة زر الاتصال بقاعدة البيانات
    const addDatabaseButton = () => {
        // التحقق من وجود الزر بالفعل
        if (document.getElementById('databaseBtn')) return;
        
        const panel = document.getElementById('aiPanel');
        if (!panel) return;
        
        // إنشاء زر قاعدة البيانات
        const dbButton = document.createElement('button');
        dbButton.id = 'databaseBtn';
        dbButton.innerHTML = '🗄️';
        dbButton.style.cssText = `
            background: #6f42c1;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            transition: background 0.3s;
        `;
        dbButton.title = 'الاتصال بقاعدة البيانات';
        
        dbButton.onmouseover = () => dbButton.style.background = '#5a32a3';
        dbButton.onmouseout = () => dbButton.style.background = '#6f42c1';
        
        dbButton.onclick = async () => {
            if (!window.SupabaseManager) {
                // تحميل مكتبة Supabase إذا لم تكن محملة
                if (window.AIUI) {
                    window.AIUI.addMessage('🔄 <strong>جاري تحميل مكتبة قاعدة البيانات...</strong>', 'bot', true);
                }
                
                // تحميل ملف الإعدادات
                const script = document.createElement('script');
                script.src = 'supabase-config.js';
                script.onload = async () => {
                    if (window.AIUI) {
                        window.AIUI.addMessage('✅ <strong>تم تحميل مكتبة قاعدة البيانات!</strong><br>جاري الاتصال...', 'bot', true);
                    }
                    await connectToDatabase();
                };
                script.onerror = () => {
                    if (window.AIUI) {
                        window.AIUI.addMessage('❌ <strong>فشل تحميل مكتبة قاعدة البيانات!</strong>', 'bot', true);
                    }
                };
                document.head.appendChild(script);
            } else {
                await connectToDatabase();
            }
        };
        
        // إضافة الزر إلى رأس لوحة المساعد
        const header = panel.querySelector('.ai-panel-header');
        if (header) {
            header.appendChild(dbButton);
        }
    };

    // إضافة زر اختبار الميكروفون
    const addMicrophoneTestButton = () => {
        // التحقق من وجود الزر بالفعل
        if (document.getElementById('micTestBtn')) return;
        
        const panel = document.getElementById('aiPanel');
        if (!panel) return;
        
        // إنشاء زر اختبار الميكروفون
        const micButton = document.createElement('button');
        micButton.id = 'micTestBtn';
        micButton.innerHTML = '🎤';
        micButton.style.cssText = `
            background: #17a2b8;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            transition: background 0.3s;
        `;
        micButton.title = 'اختبار الميكروفون';
        
        micButton.onmouseover = () => micButton.style.background = '#138496';
        micButton.onmouseout = () => micButton.style.background = '#17a2b8';
        
        micButton.onclick = async () => {
            if (!window.AISpeech) {
                if (window.AIUI) {
                    window.AIUI.addMessage('❌ <strong>محرك الصوت غير متاح!</strong><br>يرجى تحديث الصفحة', 'bot', true);
                }
                return;
            }
            
            // اختبار الميكروفون
            await window.AISpeech.testMicrophone();
        };
        
        // إضافة الزر إلى رأس لوحة المساعد
        const header = panel.querySelector('.ai-panel-header');
        if (header) {
            header.appendChild(micButton);
        }
    };

    // إضافة زر اختبار النطق الصوتي
    const addSpeechTestButton = () => {
        // التحقق من وجود الزر بالفعل
        if (document.getElementById('speechTestBtn')) return;
        
        const panel = document.getElementById('aiPanel');
        if (!panel) return;
        
        // إنشاء زر اختبار النطق
        const speechButton = document.createElement('button');
        speechButton.id = 'speechTestBtn';
        speechButton.innerHTML = '🔊';
        speechButton.style.cssText = `
            background: #28a745;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            transition: background 0.3s;
        `;
        speechButton.title = 'اختبار النطق الصوتي';
        
        speechButton.onmouseover = () => speechButton.style.background = '#218838';
        speechButton.onmouseout = () => speechButton.style.background = '#28a745';
        
        speechButton.onclick = () => {
            if (!window.AISpeech) {
                if (window.AIUI) {
                    window.AIUI.addMessage('❌ <strong>محرك الصوت غير متاح!</strong><br>يرجى تحديث الصفحة', 'bot', true);
                }
                return;
            }
            
            // اختبار النطق الصوتي
            window.AISpeech.testSpeech();
        };
        
        // إضافة الزر إلى رأس لوحة المساعد
        const header = panel.querySelector('.ai-panel-header');
        if (header) {
            header.appendChild(speechButton);
        }
    };

    // دالة الاتصال بقاعدة البيانات
    async function connectToDatabase() {
        if (!window.SupabaseManager) {
            if (window.AIUI) {
                window.AIUI.addMessage('❌ <strong>مدير قاعدة البيانات غير متاح!</strong>', 'bot', true);
            }
            return;
        }

        if (window.SupabaseManager.isConnected) {
            // عرض حالة الاتصال
            const stats = await window.SupabaseManager.getStatistics();
            if (window.AIUI) {
                window.AIUI.addMessage(`🗄️ <strong>متصل بقاعدة البيانات!</strong><br>
                    📊 عدد المنتجات: ${stats.totalProducts}<br>
                    💰 القيمة الإجمالية: ${stats.totalValue.toFixed(2)} جنيه<br>
                    📦 منتجات منخفضة المخزون: ${stats.lowStock}`, 'bot', true);
            }
        } else {
            // محاولة الاتصال
            const success = await window.SupabaseManager.init();
            if (success) {
                // تحديث لون الزر للإشارة بالاتصال
                const dbBtn = document.getElementById('databaseBtn');
                if (dbBtn) {
                    dbBtn.style.background = '#28a745';
                    dbBtn.innerHTML = '🗄️✓';
                }
            }
        }
    }
    
    // تهيئة الأزرار عند فتح المساعد
    const originalOpen = window.AIUI?.open || function() {};
    window.AIUI.open = function() {
        originalOpen.call(this);
        
        // تهيئة الأزرار مع تأخير أطول لضمان تحميل اللوحة
        setTimeout(() => {
            console.log('🔧 بدء تهيئة أزرار المساعد...');
            addCopyButton();
            addFileButton();
            addDatabaseButton();
            addMicrophoneTestButton();
            addSpeechTestButton();
            console.log('✅ تم تهيئة أزرار المساعد');
        }, 1000);
        
        // محاولة تهيئة مرة أخرى إذا لم تظهر الأزرار
        setTimeout(() => {
            const copyBtn = document.getElementById('copyDataBtn');
            const fileBtn = document.getElementById('fileSelectBtn');
            const dbBtn = document.getElementById('databaseBtn');
            const micBtn = document.getElementById('micTestBtn');
            const speechBtn = document.getElementById('speechTestBtn');
            
            if (!copyBtn || !fileBtn || !dbBtn || !micBtn || !speechBtn) {
                console.log('🔄 إعادة تهيئة الأزرار...');
                if (!copyBtn) addCopyButton();
                if (!fileBtn) addFileButton();
                if (!dbBtn) addDatabaseButton();
                if (!micBtn) addMicrophoneTestButton();
                if (!speechBtn) addSpeechTestButton();
                console.log('✅ تم إعادة تهيئة الأزرار');
            }
        }, 2000);
    };
    
    // تهيئة الأزرار أيضاً عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.AIUI && window.AIUI.isOpen) {
                console.log('🔧 تهيئة الأزرار عند تحميل الصفحة...');
                addCopyButton();
                addFileButton();
                addDatabaseButton();
                addMicrophoneTestButton();
                addSpeechTestButton();
            }
        }, 1500);
    });
    
    // تهيئة الأزرار عند تحميل الصفحة بالكامل
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.AIUI && window.AIUI.isOpen) {
                console.log('🔧 تهيئة الأزرار عند تحميل الصفحة بالكامل...');
                addCopyButton();
                addFileButton();
                addDatabaseButton();
                addMicrophoneTestButton();
                addSpeechTestButton();
            }
        }, 2000);
    });
    
    // دالة إجبارية لتهيئة الأزرار (يمكن استدعاؤها يدوياً)
    window.forceInitAssistantButtons = function() {
        console.log('🔧 إجبار تهيئة أزرار المساعد...');
        addCopyButton();
        addFileButton();
        addDatabaseButton();
        addMicrophoneTestButton();
        addSpeechTestButton();
        console.log('✅ تم إجبار تهيئة الأزرار');
    };
    
    // محاولة تهيئة الأزرار كل 5 ثوانٍ إذا لم تكن موجودة
    setInterval(() => {
        if (window.AIUI && window.AIUI.isOpen) {
            const copyBtn = document.getElementById('copyDataBtn');
            const fileBtn = document.getElementById('fileSelectBtn');
            const dbBtn = document.getElementById('databaseBtn');
            const micBtn = document.getElementById('micTestBtn');
            const speechBtn = document.getElementById('speechTestBtn');
            const panel = document.getElementById('aiPanel');
            
            if (panel && (!copyBtn || !fileBtn || !dbBtn || !micBtn || !speechBtn)) {
                console.log('🔄 اكتشاف أزرار مفقودة، إعادة التهيئة...');
                if (!copyBtn) addCopyButton();
                if (!fileBtn) addFileButton();
                if (!dbBtn) addDatabaseButton();
                if (!micBtn) addMicrophoneTestButton();
                if (!speechBtn) addSpeechTestButton();
            }
        }
    }, 5000);
    const monitorBulkTable = () => {
        if (!window.location.pathname.includes('bulk-add')) return;

        // فحص الجدول بشكل دوري أو عند حدوث تغيير
        const observer = new MutationObserver(() => {
            const table = document.getElementById('previewTable');
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                let errors = { missingName: 0, zeroPrice: 0, invalidDate: 0 };
                
                rows.forEach(row => {
                    const cells = row.cells;
                    // افتراض ترتيب الأعمدة: الاسم[0], السعر[1], الكمية[2], الخصم[3], الانتهاء[4]
                    if (!cells[0]?.innerText.trim()) errors.missingName++;
                    if (parseFloat(cells[1]?.innerText) === 0) errors.zeroPrice++;
                    if (cells[4]?.innerText.includes('-')) { // تاريخ خاطئ أو مفقود
                         // منطق إضافي لفحص التواريخ إذا لزم الأمر
                    }
                });

                const totalErrors = errors.missingName + errors.zeroPrice;
                if (totalErrors > 0 && window._lastBulkErrorCount !== totalErrors) {
                    let msg = `⚠️ <strong>لقيت مشكلات في الجدول:</strong><br>`;
                    if (errors.missingName) msg += `• في ${errors.missingName} صنف ملهومش اسم.<br>`;
                    if (errors.zeroPrice) msg += `• في ${errors.zeroPrice} أصناف سعرهم صفر.<br>`;
                    msg += `💡 يفضل تصلحهم في ملف الإكسيل وترفعه تاني أو تعدلهم في الجدول.`;

                    AIUI.open();
                    AIUI.addMessage(msg, 'bot', true);
                    if (window.AISpeech) window.AISpeech.speak("لقيت مشكلات في البيانات اللي رفعتها، بص على التنبيهات في الجدول");
                    window._lastBulkErrorCount = totalErrors;
                }
            }
        });

        const target = document.body;
        observer.observe(target, { childList: true, subtree: true });
    };

    monitorBulkTable();

})();
