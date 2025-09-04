  // ---- Ayarlar
  const BATCH = 25;

  // TR harfleri ve küçük/büyük için normalize
  const mapTR = {'İ':'i','I':'i','ı':'i','Ş':'s','ş':'s','Ğ':'g','ğ':'g','Ç':'c','ç':'c','Ö':'o','ö':'o','Ü':'u','ü':'u'};
  const norm = s => (s||'')
    .replace(/[İIışğçöüŞĞÇÖÜ]/g, ch => mapTR[ch] || ch)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')   // diacritics
    .replace(/\s+/g,'');

  // UI
  const grid = document.getElementById('srGrid');
  const search = document.getElementById('srSearch');
  const moreBtn = document.getElementById('srMoreBtn');
  const allDone = document.getElementById('srAllDone');

  // Veri: sayfanda 'provinces' zaten varsa onu kullan, yoksa fallback
  const full = (window.provinces && window.provinces.length) ? window.provinces.slice() : [
    "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Şanlıurfa","Siirt","Sinop","Sivas","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"
  ];

  // Chip şablonu
  const checkSVG = `<svg class="sr-check" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity=".15"></circle><path d="M7 12.5l3.2 3.2L17.5 9.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

  let offset = 0, inSearch = false;

  function render(list, append=false){
    if(!append) grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach(name=>{
      const li = document.createElement('li');
      li.className = 'sr-chip';
      li.dataset.name = norm(name);
      li.innerHTML = checkSVG + `<span>${name}</span>`;
      frag.appendChild(li);
    });
    grid.appendChild(frag);
  }

  function updateMoreUI(){
    if(inSearch){ moreBtn.hidden = true; allDone.hidden = true; return; }
    if(offset < full.length){ moreBtn.hidden = false; allDone.hidden = true; }
    else { moreBtn.hidden = true; allDone.hidden = false; }
  }

  function renderMore(){
    const end = Math.min(offset + BATCH, full.length);
    render(full.slice(offset, end), /*append*/ true);
    offset = end;
    updateMoreUI();
  }

  // Başlangıç: ilk 25
  renderMore();

  // Daha fazla
  moreBtn.addEventListener('click', renderMore);

  // Arama (case/diacritics/TR-insensitive)
  search.addEventListener('input', e=>{
    const q = norm(e.target.value);
    if(!q){
      inSearch = false;
      grid.innerHTML = '';
      offset = 0;
      renderMore();           // batch görünümüne dön
      return;
    }
    inSearch = true;
    const results = full.filter(n => norm(n).includes(q));
    render(results, false);
    updateMoreUI();           // butonu gizle
  });


  

  // Kolay düzenleme: görseller, başlıklar, linkler
  const services = [
    {img:'images/work-1.jpg', title:'Klima Servisi',          url:'klima.html'},
    {img:'images/work-2.jpg', title:'Fırın Servisi',          url:'firin.html'},
    {img:'images/work-3.jpg', title:'Televizyon Servisi',     url:'televizyon.html'},
    {img:'images/work-4.jpg', title:'Çamaşır Makinesi Servisi', url:'camasirmakinesi.html'},
    {img:'images/work-5.jpg', title:'Buzdolabı Servisi',      url:'buzdolabi.html'},
    {img:'images/work-6.jpg', title:'Kurutma Makinesi Servisi', url:'kurutmamakinesi.html'},
    {img:'images/work-7.jpg', title:'Bulaşık Makinesi Servisi', url:'bulasikmakinesi.html'},
    {img:'images/work-8.jpg', title:'Kombi Servisi',          url:'kombi.html'},
  ];

  const track = document.getElementById('svcTrack');
const link  = document.getElementById('svcLink');
let active = 0; // seçili kart index'i


  function makeGroup(items){
    const frag = document.createDocumentFragment();
    items.forEach(s => {
      const card = document.createElement('article');
      card.className = 'svc-card';

      const linkImg = document.createElement('a');
      linkImg.href = s.url; linkImg.setAttribute('aria-label', s.title);
      const img = document.createElement('img');
      img.src = s.img; img.alt = s.title; img.className = 'svc-img';
      linkImg.appendChild(img);

      const meta = document.createElement('div'); meta.className = 'svc-meta';
      const h = document.createElement('h3'); h.className = 'svc-title';
      const aTitle = document.createElement('a'); aTitle.href = s.url; aTitle.textContent = s.title; aTitle.style.textDecoration='none'; aTitle.style.color='inherit';
      h.appendChild(aTitle);

      const go = document.createElement('a'); go.className = 'svc-go'; go.href = s.url; go.setAttribute('aria-label', s.title + ' sayfasına git');
      go.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                      </svg>`;

      meta.append(h, go);
      card.append(linkImg, meta);
      frag.append(card);
    });
    return frag;
  }

  // Sonsuz kaydırma için aynı grubu iki kez ekle
  track.append(makeGroup(services), makeGroup(services));