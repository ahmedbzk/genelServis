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


  