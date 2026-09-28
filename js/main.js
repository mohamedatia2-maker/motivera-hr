document.addEventListener('DOMContentLoaded', ()=>{

  // 🔍 البحث
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const searchForm = document.getElementById('searchForm');

  searchBtn && searchBtn.addEventListener('click', ()=> {
    searchOverlay.classList.add('active');
    searchOverlay.setAttribute('aria-hidden','false');
    const q = document.getElementById('q');
    setTimeout(()=> q && q.focus(), 150);
  });

  closeSearch && closeSearch.addEventListener('click', ()=> {
    searchOverlay.classList.remove('active');
    searchOverlay.setAttribute('aria-hidden','true');
  });

  searchOverlay && searchOverlay.addEventListener('click', (e)=>{
    if(e.target === searchOverlay){
      searchOverlay.classList.remove('active');
      searchOverlay.setAttribute('aria-hidden','true');
    }
  });

  searchForm && searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = document.getElementById('q').value.trim();
    if(q){
      alert('بحث: ' + q + '\n(خاص بالواجهة، لا يوجد باك إند في هذه النسخة)');
    }
  });


  // 📱 القائمة الجوال
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  mobileToggle && mobileToggle.addEventListener('click', ()=> {
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden','false');
  });

  mobileClose && mobileClose.addEventListener('click', ()=> {
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden','true');
  });

  mobileMenu && mobileMenu.addEventListener('click', (e)=>{
    if(e.target === mobileMenu){
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden','true');
    }
  });


  // 🧩 تأثيرات الظهور عند التمرير
  const fadeElements = document.querySelectorAll(".fade-in");
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  fadeElements.forEach(el => appearOnScroll.observe(el));


  // 🔁 سكرول الشركاء المستمر
  const track = document.getElementById('partnersTrack');
  if (track) {
    let speed = 1;
    let translateX = 0;

    function loop() {
      translateX -= speed;
      const first = track.children[0];
      const firstWidth = first.offsetWidth + 60;
      if (Math.abs(translateX) >= firstWidth) {
        track.appendChild(first);
        translateX += firstWidth;
      }
      track.style.transform = `translateX(${translateX}px)`;
      requestAnimationFrame(loop);
    }
    loop();
  }


  // 📄 الفلاتر في صفحة مركز المعرفة
  const buttons = document.querySelectorAll('.filter-btn');
  const sections = document.querySelectorAll('.section');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const sectionToShow = btn.getAttribute('data-section');
      sections.forEach(section => {
        if (sectionToShow === 'all' || section.classList.contains(sectionToShow)) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });


  // ✉️ نموذج التواصل
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      alert('تم إرسال النموذج (عرض تجريبي فقط، بدون إرسال فعلي).');
      this.reset();
    });
  }

});
 document.getElementById('serviceForm').addEventListener('submit', function(e){
      e.preventDefault();
      alert('تم إرسال الطلب (عرض تجريبي فقط)');
      this.reset();
    });
    document.addEventListener('DOMContentLoaded', () => {
        const track = document.getElementById('testimonialsTrack');
        const wrapper = document.querySelector('.testimonials-wrapper'); 
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const cards = document.querySelectorAll('.testimonial-card');

        // تحقق إضافي لضمان وجود جميع العناصر
        if (!track || !wrapper || cards.length === 0) return;

        // متغير لتخزين عدد البطاقات المراد تمريرها
        let cardsToScroll = 1; 

        // عدد البطاقات الكلي
        const totalCards = cards.length;
        // مؤشر البطاقة الحالية المرئية في أقصى اليمين (في وضع RTL)
        let currentIndex = 0; 

        // ⚠️ مهم: حساب العرض الكامل للبطاقة مع الهامش
        // الهامش هو 10px يمين و 10px يسار = 20px كفجوة بين البطاقات
        const CARD_GAP = 20; 
        
        let cardFullWidth;

        function updateCardDimensions() {
             if (cards.length > 0) {
                 // 💡 التعديل: استخدام getBoundingClientRect().width بدلاً من offsetWidth 
                 // هذا أكثر دقة في بعض المتصفحات ويتجاهل تأثير التحويل (Transform) إذا كان مطبقاً
                 cardFullWidth = cards[0].getBoundingClientRect().width + CARD_GAP;
                 
                 // حساب عدد البطاقات التي يجب تمريرها (ديناميكيًا)
                 cardsToScroll = Math.floor(wrapper.getBoundingClientRect().width / cardFullWidth);
                 // التأكد من أن الحد الأدنى هو 1
                 cardsToScroll = Math.max(1, cardsToScroll); 
             }
        }
        
        function updatePosition() {
             // تحديث العرض والأبعاد في حالة تغيير حجم الشاشة
             updateCardDimensions();

             // الإزاحة: مؤشر البطاقة * العرض الكامل للوحدة (بطاقة واحدة)
             const offset = -currentIndex * cardFullWidth;
             
             // في RTL، الحركة لليسار تكون بقيمة سالبة 
             track.style.transform = `translateX(${offset}px)`;
        }

        nextBtn.addEventListener('click', () => {
            // التحرك للخلف (لليسار) في وضع RTL.
            const maxIndex = totalCards - cardsToScroll;

            if (currentIndex < maxIndex) { 
                currentIndex += cardsToScroll;
                // التأكد من عدم تجاوز الحد الأقصى إذا كانت الخطوة كبيرة
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
            } else {
                 // الوصول للنهاية
                 currentIndex = maxIndex;
            }
            updatePosition();
            checkBoundaries();
        });

        prevBtn.addEventListener('click', () => {
             // التحرك للأمام (لليمين) في وضع RTL.
            if (currentIndex > 0) {
                currentIndex -= cardsToScroll;
                // التأكد من عدم النزول تحت الصفر
                 if (currentIndex < 0) {
                    currentIndex = 0;
                }
            } else {
                 // الوصول للبداية
                 currentIndex = 0;
            }
            updatePosition();
            checkBoundaries();
        });
        
        function checkBoundaries() {
            const maxIndex = totalCards - cardsToScroll;

            // تعطيل الزر في حال الوصول للبداية/النهاية
            // يجب أن يكون maxIndex على الأقل 0، إذا كان عدد البطاقات الكلي أقل من أو يساوي عدد البطاقات المعروضة
            const isDisabled = (totalCards <= cardsToScroll);
            
            prevBtn.disabled = isDisabled || currentIndex === 0;
            nextBtn.disabled = isDisabled || currentIndex >= maxIndex;
            
            // إضافة تأثير بصري عند التعطيل
            prevBtn.style.opacity = (isDisabled || currentIndex === 0) ? 0.5 : 1;
            nextBtn.style.opacity = (isDisabled || currentIndex >= maxIndex) ? 0.5 : 1;
        }

        // 📐 التحديث عند تغيير حجم الشاشة
        window.addEventListener('resize', () => {
            // عند تغيير الحجم، يجب إعادة حساب الأبعاد والموضع دون إعادة تعيين المؤشر
            updatePosition();
            checkBoundaries();
        });
        
        // 🚀 نقطة التشغيل الرئيسية
        // استخدام setTimeout لضمان اكتمال تحميل الـ CSS وتطبيق الأنماط الخارجية في الموقع الأساسي
        const initializeCarousel = () => {
            updateCardDimensions();
            updatePosition();
            checkBoundaries();
        }
        
        // محاولة التشغيل فورًا
        initializeCarousel();
        
        // محاولة التشغيل بعد تأخير بسيط لضمان تحميل الـ Styles الخارجية 
        setTimeout(initializeCarousel, 100); 
    });