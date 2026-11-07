/* Lucent — curated content written for this app (palate, calibration, word lore). */
window.LX = window.LX || {};

/* Hand-checked pronunciations for curated words (override the dictionary). */
LX.PRON = {
  'triage': ['TREE-ahzh', '/triˈɑʒ/'],
  'abstract': ['AB-strakt', '/ˈæb.strækt/'],
  'parvenu': ['PAR-vuh-noo', '/ˈpɑr.və.nu/'],
  'egress': ['EE-gres', '/ˈi.ɡrɛs/'],
  'articulate': ['ar-TIK-yuh-luht', '/ɑrˈtɪk.jə.lət/'],
  'whippersnapper': ['WIP-er-snap-er', '/ˈwɪp.ərˌsnæp.ər/'],
  'hornswoggle': ['HORN-swog-uhl', '/ˈhɔrnˌswɑɡ.əl/'],
  'gobbledygook': ['GOB-uhl-dee-gook', '/ˈɡɑb.əl.diˌɡʊk/'],
  'bamboozle': ['bam-BOO-zuhl', '/bæmˈbu.zəl/'],
  'skedaddle': ['skih-DAD-l', '/skɪˈdæd.əl/'],
  'canoodle': ['kuh-NOO-duhl', '/kəˈnu.dəl/'],
  'sombre': ['SOM-ber', '/ˈsɑm.bər/'],
  'salubrious': ['suh-LOO-bree-uhs', '/səˈlu.bri.əs/'],
  'sumptuous': ['SUMP-choo-uhs', '/ˈsʌmp.tʃu.əs/'],
  'pulchritude': ['PUL-krih-tood', '/ˈpʌl.krɪˌtud/'],
  'capitulate': ['kuh-PICH-uh-layt', '/kəˈpɪtʃ.əˌleɪt/'],
  'bureaucracy': ['byoo-ROK-ruh-see', '/bjʊˈrɑk.rə.si/'],
  'lucent': ['LOO-suhnt', '/ˈlu.sənt/'],
  'notarize': ['NOH-tuh-ryz', '/ˈnoʊ.təˌraɪz/'],
  'magniloquent': ['mag-NIL-uh-kwuhnt', '/mæɡˈnɪl.ə.kwənt/'],
  'mellifluent': ['muh-LIF-loo-uhnt', '/məˈlɪf.lu.ənt/'],
  'bumfuzzle': ['bum-FUZ-uhl', '/bʌmˈfʌz.əl/'],
  'cattywampus': ['KAT-ee-wom-puhs', '/ˈkæt.iˌwɑm.pəs/'],
  'higgledy-piggledy': ['HIG-uhl-dee-PIG-uhl-dee', '/ˌhɪɡ.əl.diˈpɪɡ.əl.di/'],
  'snollygoster': ['SNOL-ee-gos-ter', '/ˈsnɑl.iˌɡɑs.tər/'],
  'fuddy-duddy': ['FUD-ee-dud-ee', '/ˈfʌd.iˌdʌd.i/'],
  'wishy-washy': ['WISH-ee-wosh-ee', '/ˈwɪʃ.iˌwɑʃ.i/'],
  'liquidated': ['LIK-wih-day-tid', '/ˈlɪk.wɪˌdeɪ.tɪd/'],
  'jurisdiction': ['joor-is-DIK-shuhn', '/ˌdʒʊr.ɪsˈdɪk.ʃən/'],
  'jurisprudence': ['joor-is-PROO-duhns', '/ˌdʒʊr.ɪsˈpru.dəns/'],
  'neurological': ['noor-uh-LOJ-ih-kuhl', '/ˌnʊr.əˈlɑdʒ.ɪ.kəl/'],
  'pulmonary': ['PUL-muh-ner-ee', '/ˈpʊl.məˌnɛr.i/'],
  'kerfuffle': ['ker-FUF-uhl', '/kərˈfʌf.əl/'],
  'brouhaha': ['BROO-hah-hah', '/ˈbruˌhɑ.hɑ/'],
  'flabbergasted': ['FLAB-er-gas-tid', '/ˈflæb.ərˌɡæs.tɪd/'],
  'discombobulated': ['dis-kuhm-BOB-yuh-lay-tid', '/ˌdɪs.kəmˈbɑb.jəˌleɪ.tɪd/'],
  'persnickety': ['per-SNIK-ih-tee', '/pərˈsnɪk.ɪ.ti/'],
  'dilettante': ['DIL-ih-tahnt', '/ˈdɪl.ɪˌtɑnt/'],
  'sabotage': ['SAB-uh-tahzh', '/ˈsæb.əˌtɑʒ/'],
  susurrus: ['soo-SUR-uhs', '/suˈsɜr.əs/'], kerfuffle: ['ker-FUF-uhl', '/kərˈfʌf.əl/'], gravitas: ['GRAV-ih-tahs', '/ˈɡræv.ɪ.tɑs/'],
  petrichor: ['PET-rih-kor', '/ˈpɛt.rɪ.kɔr/'], mellifluous: ['muh-LIF-loo-uhs', '/məˈlɪf.lu.əs/'], brusque: ['bruhsk', '/brʌsk/'],
  candid: ['KAN-did', '/ˈkæn.dɪd/'], meticulous: ['muh-TIK-yuh-luhs', '/məˈtɪk.jə.ləs/'], reluctant: ['rih-LUK-tuhnt', '/rɪˈlʌk.tənt/'],
  ambiguous: ['am-BIG-yoo-uhs', '/æmˈbɪɡ.ju.əs/'], vivid: ['VIV-id', '/ˈvɪv.ɪd/'], pragmatic: ['prag-MAT-ik', '/præɡˈmæt.ɪk/'],
  ubiquitous: ['yoo-BIK-wih-tuhs', '/juˈbɪk.wɪ.təs/'], scrutinize: ['SKROO-tuh-nyz', '/ˈskru.tə.naɪz/'], frugal: ['FROO-guhl', '/ˈfru.ɡəl/'],
  tenacious: ['tuh-NAY-shuhs', '/təˈneɪ.ʃəs/'], sagacious: ['suh-GAY-shuhs', '/səˈɡeɪ.ʃəs/'], ephemeral: ['ih-FEM-er-uhl', '/ɪˈfɛm.ər.əl/'],
  obstinate: ['OB-stuh-nit', '/ˈɑb.stə.nɪt/'], laconic: ['luh-KON-ik', '/ləˈkɑn.ɪk/'], magnanimous: ['mag-NAN-uh-muhs', '/mæɡˈnæn.ə.məs/'],
  obsequious: ['uhb-SEE-kwee-uhs', '/əbˈsi.kwi.əs/'], perfunctory: ['per-FUNGK-tuh-ree', '/pərˈfʌŋk.tə.ri/'], recalcitrant: ['rih-KAL-sih-truhnt', '/rɪˈkæl.sɪ.trənt/'],
  insouciant: ['in-SOO-see-uhnt', '/ɪnˈsu.si.ənt/'], perspicacious: ['pur-spih-KAY-shuhs', '/ˌpɜr.spɪˈkeɪ.ʃəs/'], pusillanimous: ['pyoo-suh-LAN-uh-muhs', '/ˌpju.səˈlæn.ə.məs/'],
  sesquipedalian: ['ses-kwih-puh-DAY-lee-uhn', '/ˌsɛs.kwɪ.pəˈdeɪ.li.ən/'], perfidious: ['per-FID-ee-uhs', '/pərˈfɪd.i.əs/'], punctilious: ['puhngk-TIL-ee-uhs', '/pʌŋkˈtɪl.i.əs/'],
  obdurate: ['OB-duh-rit', '/ˈɑb.də.rɪt/'], crepuscular: ['krih-PUS-kyuh-ler', '/krɪˈpʌs.kjə.lər/'], tergiversate: ['ter-JIV-er-sayt', '/tərˈdʒɪv.ər.seɪt/'],
  lachrymose: ['LAK-ruh-mohs', '/ˈlæk.rə.moʊs/'], adumbrate: ['AD-uhm-brayt', '/ˈæd.əm.breɪt/'], sciolism: ['SY-uh-liz-uhm', '/ˈsaɪ.ə.lɪz.əm/'],
  precedent: ['PRES-ih-duhnt', '/ˈprɛs.ɪ.dənt/'], equanimity: ['ee-kwuh-NIM-ih-tee', '/ˌi.kwəˈnɪm.ɪ.ti/'], sardonic: ['sahr-DON-ik', '/sɑrˈdɑn.ɪk/'],
  leverage: ['LEV-er-ij', '/ˈlɛv.ər.ɪdʒ/'], unctuous: ['UNGK-choo-uhs', '/ˈʌŋk.tʃu.əs/'], duplicitous: ['doo-PLIS-ih-tuhs', '/duˈplɪs.ɪ.təs/'],
  sanctimonious: ['sangk-tuh-MOH-nee-uhs', '/ˌsæŋk.təˈmoʊ.ni.əs/'], mercenary: ['MUR-suh-ner-ee', '/ˈmɜr.sə.nɛr.i/'], covenant: ['KUV-uh-nuhnt', '/ˈkʌv.ə.nənt/'],
  troth: ['trawth', '/trɔθ/'], creed: ['kreed', '/krid/'], guarantee: ['gar-uhn-TEE', '/ˌɡær.ənˈti/'], probity: ['PROH-bih-tee', '/ˈproʊ.bɪ.ti/'],
  fortitude: ['FOR-tih-tood', '/ˈfɔr.tɪ.tud/'], eloquence: ['EL-uh-kwuhns', '/ˈɛl.ə.kwəns/'], prosperity: ['pro-SPER-ih-tee', '/prɑˈspɛr.ɪ.ti/'],
  intrepid: ['in-TREP-id', '/ɪnˈtrɛp.ɪd/'], insinuation: ['in-sin-yoo-AY-shuhn', '/ɪnˌsɪn.juˈeɪ.ʃən/'], loquacious: ['loh-KWAY-shuhs', '/loʊˈkweɪ.ʃəs/'],
  melancholy: ['MEL-uhn-kol-ee', '/ˈmɛl.ən.kɑl.i/'], reverie: ['REV-uh-ree', '/ˈrɛv.ə.ri/'], ataraxia: ['at-uh-RAK-see-uh', '/ˌæt.əˈræk.si.ə/'],
  indemnity: ['in-DEM-nih-tee', '/ɪnˈdɛm.nɪ.ti/'], solace: ['SOL-is', '/ˈsɑl.ɪs/']
};

/* ---------- The Palate ----------
   Axes: L legal · P philosophy · T literary · C commercial · O ornate
   Roots: latin, greek, french, germanic (plain English / Norse / Scots) */
LX.PALATE = {
  instinct: [
    { w: 'susurrus', root: 'latin', axes: { T: 1, O: 1 }, m: 'a soft whispering or rustling sound' },
    { w: 'kerfuffle', root: 'germanic', axes: { T: 0.5 }, m: 'a commotion or fuss, often over a difference of opinion' },
    { w: 'gravitas', root: 'latin', axes: { P: 1, L: 0.5 }, m: 'dignity and seriousness of manner' },
    { w: 'petrichor', root: 'greek', axes: { T: 1, O: 1 }, m: 'the earthy scent that rises when rain falls on dry ground' },
    { w: 'mellifluous', root: 'latin', axes: { T: 1, O: 1 }, m: 'sweet and smooth-flowing to hear, like honey' },
    { w: 'brusque', root: 'french', axes: { C: 0.5 }, m: 'abrupt or offhand in speech or manner' }
  ],
  weapon: [
    { q: 'One word to end an argument.', o: [
      { w: 'Precedent', a: 'L', m: 'an earlier case used as an example or rule' },
      { w: 'Equanimity', a: 'P', m: 'calmness of mind, even under strain' },
      { w: 'Sardonic', a: 'T', m: 'grimly mocking or cynical' },
      { w: 'Leverage', a: 'C', m: 'an advantage used to get what you want' }] },
    { q: 'Describe a rival who smiles too much.', o: [
      { w: 'Duplicitous', a: 'L', m: 'deceitful; two-faced' },
      { w: 'Sanctimonious', a: 'P', m: 'acting morally superior to others' },
      { w: 'Unctuous', a: 'T', m: 'excessively flattering, oily in manner' },
      { w: 'Mercenary', a: 'C', m: 'motivated only by money or gain' }] },
    { q: 'A promise that must never be broken.', o: [
      { w: 'Covenant', a: 'L', m: 'a solemn, binding agreement' },
      { w: 'Creed', a: 'P', m: 'a set of beliefs that guide one’s actions' },
      { w: 'Troth', a: 'T', m: 'an old word for a pledge of faithfulness' },
      { w: 'Guarantee', a: 'C', m: 'a formal assurance that terms will be met' }] },
    { q: 'The word carved above your door.', o: [
      { w: 'Probity', a: 'L', m: 'strong moral principles; honesty' },
      { w: 'Fortitude', a: 'P', m: 'courage in pain or adversity' },
      { w: 'Eloquence', a: 'T', m: 'fluent, persuasive speaking or writing' },
      { w: 'Prosperity', a: 'C', m: 'the state of flourishing, especially financially' }] }
  ],
  pairs: [
    ['brave', 'intrepid'], ['hint', 'insinuation'], ['talkative', 'loquacious'], ['sadness', 'melancholy']
  ]
};

/* Tasting notes: [root phrase] + [finish by strongest axis] */
LX.ROOT_PHRASE = { latin: 'Latin-rooted', greek: 'Greek-rooted', french: 'French-tinged', germanic: 'Plain-spoken', mixed: 'Well-travelled' };
LX.FINISH = {
  L: ['with a courtroom finish.', 'precise in argument, unhurried in judgement'],
  P: ['with a philosopher’s finish.', 'drawn to words that weigh ideas and steady the mind'],
  T: ['with a novelist’s finish.', 'drawn to words with colour, mood and music'],
  C: ['with a boardroom finish.', 'drawn to words that close deals and count the cost'],
  O: ['with an ornate finish.', 'unafraid of the grand word when the plain one will not do']
};
LX.TRAITS = { L: 'Precise', P: 'Contemplative', T: 'Literary', C: 'Shrewd', O: 'Ornate',
  latin: 'Latin-rooted', greek: 'Greek-rooted', french: 'French-tinged', germanic: 'Earthy', plain: 'Economical' };

/* ---------- Calibration: 6 levels × 5 words. Correct answer first; shuffled in the app. ---------- */
LX.CALIB = [
  [ ['candid', ['honest and direct', 'carefully hidden', 'sweet to the taste', 'easily broken']],
    ['meticulous', ['very careful about small details', 'measured in metres', 'quick-tempered', 'shy in company']],
    ['reluctant', ['unwilling and hesitant', 'shining brightly', 'able to return', 'deeply grateful']],
    ['ambiguous', ['open to more than one meaning', 'able to use both hands', 'extremely ambitious', 'lasting a short time']],
    ['vivid', ['bright, intense and clear', 'full of envy', 'quietly hopeful', 'related to grapes']] ],
  [ ['pragmatic', ['practical rather than idealistic', 'fond of rules', 'easily frightened', 'related to grammar']],
    ['ubiquitous', ['found everywhere', 'very old and worn', 'hard to see clearly', 'spoken too loudly']],
    ['scrutinize', ['examine closely', 'scold harshly', 'scatter widely', 'write by hand']],
    ['frugal', ['careful with money', 'easily broken', 'bearing much fruit', 'cold and distant']],
    ['tenacious', ['holding firmly; persistent', 'thin and weak', 'tense and nervous', 'renting a home']] ],
  [ ['sagacious', ['wise, with keen judgement', 'sad and drooping', 'fond of long stories', 'easily fooled']],
    ['ephemeral', ['lasting a very short time', 'related to the sky', 'heavy and solid', 'openly hostile']],
    ['obstinate', ['stubbornly refusing to change', 'blocking the view', 'clearly obvious', 'easily forgotten']],
    ['laconic', ['using very few words', 'lacking colour', 'overly emotional', 'related to lakes']],
    ['magnanimous', ['generous and forgiving', 'enormous in size', 'magnetic and charming', 'greedy for power']] ],
  [ ['obsequious', ['too eager to please or obey', 'hard to understand', 'following in order', 'deeply sorrowful']],
    ['perfunctory', ['done with little care or effort', 'perfectly timed', 'highly efficient', 'strongly scented']],
    ['recalcitrant', ['stubbornly uncooperative', 'calculated again', 'easily recalled', 'chalky in texture']],
    ['insouciant', ['carelessly unconcerned', 'not sufficient', 'sour in taste', 'openly rude']],
    ['perspicacious', ['quick to notice and understand', 'sweating heavily', 'stubbornly persistent', 'clearly visible']] ],
  [ ['pusillanimous', ['lacking courage; timid', 'unanimously agreed', 'puzzled and confused', 'small but powerful']],
    ['sesquipedalian', ['given to using long words', 'walking on foot', 'occurring every six months', 'having three legs']],
    ['perfidious', ['deceitful and untrustworthy', 'perfectly formed', 'fragrant', 'hard-working']],
    ['punctilious', ['very attentive to correct detail', 'sharp and pointed', 'always late', 'quarrelsome']],
    ['obdurate', ['stubbornly refusing to change', 'long-lasting', 'cheerfully obedient', 'hidden from view']] ],
  [ ['crepuscular', ['relating to twilight', 'wrinkled and dry', 'crawling slowly', 'brittle and crisp']],
    ['tergiversate', ['make evasive or conflicting statements', 'travel around the world', 'turn into stone', 'end something abruptly']],
    ['lachrymose', ['tearful; given to weeping', 'lacking moisture', 'milky in colour', 'lazy and slow']],
    ['adumbrate', ['outline or hint at', 'shade from the sun', 'add numbers together', 'praise highly']],
    ['sciolism', ['a shallow show of knowledge', 'a fear of shadows', 'the study of bones', 'a cutting remark']] ]
];
/* level → preferred rarity tiers for new-word suggestions */
LX.LEVEL_TIERS = { 1: [35, 40], 2: [40, 50], 3: [50, 50], 4: [50, 55], 5: [55, 60], 6: [60, 70] };

/* ---------- Ranks, levels, seals ---------- */
LX.CARD_LEVELS = [
  { n: 'Stranger', at: 0 }, { n: 'Acquaintance', at: 3 }, { n: 'Familiar', at: 8 }, { n: 'Fluent', at: 15 }, { n: 'Silver-Tongued', at: 30 }
];
LX.RANKS = ['Apprentice', 'Scribe', 'Wordsmith', 'Orator', 'Laureate'];
LX.SEALS = [
  { id: 'first', n: 'First word', d: 'Keep your first word in the Treasury', t: 'Common', w: 'You kept your first word in the Treasury. Every great lexicon begins with one.' },
  { id: 'ten', n: '10 words', d: 'Keep 10 words', t: 'Common', w: 'Ten words now rest in your Treasury. A collection has begun.' },
  { id: 'streak7', n: '7-day streak', d: 'Practise 7 days in a row', t: 'Common', w: 'Seven days in a row. A habit is taking root.' },
  { id: 'hundred', n: '100 words', d: 'Keep 100 words', t: 'Uncommon', w: 'One hundred words in your Treasury. Your lexicon has real weight now.' },
  { id: 'fluent', n: 'First Fluent', d: 'Raise a card to Fluent', t: 'Uncommon', w: 'Your first card has risen to Fluent, its border now edged in gold.' },
  { id: 'scribe', n: 'Wordsmith', d: 'Write 10 sentences the Sentence Judge accepts', t: 'Uncommon', w: 'Ten sentences of your own, each judged well used. You write with the words you keep.' },
  { id: 'streak30', n: '30-day streak', d: 'Practise 30 days in a row', t: 'Rare', w: 'Thirty days without a break. Discipline worthy of Marcus Aurelius.' },
  { id: 'perfect', n: 'Flawless', d: 'Answer 25 in a row correctly', t: 'Rare', w: 'Twenty-five answers in a row, not one wrong. Flawless.' },
  { id: 'spartan', n: 'Spartan', d: 'Keep 300 words', t: 'Rare', w: 'Three hundred words now stand in your Treasury, a phalanx few will ever raise.' },
  { id: 'streak100', n: 'Centurion', d: 'Practise 100 days in a row', t: 'Rare', w: 'One hundred days in a row. The sun has risen on your practice a hundred times.' },
  { id: 'asc25', n: 'Argentum', d: 'Win 25 Ascension Trials', t: 'Epic', w: 'Twenty-five ascensions. Twenty-five times a word rose under your hand.' },
  { id: 'asc50', n: 'Aurum', d: 'Win 50 Ascension Trials', t: 'Epic', w: 'Fifty ascensions. Fifty times a word rose under your hand. Gold suits you.' },
  { id: 'silver', n: 'Silver tongue', d: 'Raise a card to Silver-Tongued', t: 'Legendary', w: 'A word has reached the highest level. Eloquentia: your first Silver-Tongued card.' },
  { id: 'asc100', n: 'Adamant', d: 'Win 100 Ascension Trials', t: 'Legendary', w: 'One hundred ascensions. Unbreakable, like the diamond the ancients called adamant.' },
  { id: 'magna', n: 'Magna Cum Laude', d: 'Hold 5 Silver-Tongued cards', t: 'Legendary', w: 'Five words, Silver-Tongued. With great honour.' },
  { id: 'summa', n: 'Summa Cum Laude', d: 'Hold 10 Silver-Tongued cards', t: 'Legendary', w: 'Ten words, Silver-Tongued. The highest honour, with distinction beyond measure.' },
  { id: 'lucent', n: 'Lucent', d: 'Win 10 Ascension Trials in a row without a loss, with at least 25 words kept', t: 'The grandest', w: 'Ten trials in a row, without a single loss. The rarest honour in Lucent. Your words shine.' }
];

/* ---------- Word Lore. k: 'fact' = recorded history; 'story' = a popular story (may not be true) ---------- */
LX.LORE = [
  ['etiquette', 'Versailles · 1600s', 'story', 'In French, étiquette meant a small ticket or label. The story goes that at Versailles, Louis XIV’s gardener posted little signs — étiquettes — warning courtiers to keep off the lawns. In time, “keeping to the étiquette” came to mean following the rules of polite conduct.', 'The “label” meaning is recorded fact; the gardener tale is a popular story.'],
  ['quarantine', 'Venice · 1400s', 'fact', 'During the plague years, ships arriving in Venice were made to wait offshore for quaranta giorni — forty days — before anyone could land. The Venetian word for that forty-day wait became our quarantine.', ''],
  ['salary', 'Rome · antiquity', 'story', 'Salary comes from the Latin salarium, built on sal, “salt.” It is often said that Roman soldiers were paid in salt. Historians have found little proof of that; the link to salt is real, but how it worked is still debated.', 'The salt root is fact; “paid in salt” is unproven.'],
  ['sabotage', 'France · 1800s', 'story', 'A favourite tale says angry workers threw their wooden shoes — sabots — into machines to wreck them. The real path is humbler: saboter meant to clatter about clumsily in clogs, and so to botch a job on purpose.', 'The clog-throwing tale is popular but unproven.'],
  ['nightmare', 'Old English', 'fact', 'The mare in nightmare has nothing to do with horses. In Old English a mære was an evil spirit believed to sit on the chest of sleepers and smother them with bad dreams.', ''],
  ['clue', 'Greek myth', 'fact', 'A clew was a ball of thread. In the myth of the Minotaur, Theseus unwound a clew through the labyrinth to find his way back out. Anything that guides you through a puzzle became a clue.', ''],
  ['sincere', 'Rome · antiquity', 'story', 'A charming tale says Roman sculptors hid cracks in marble with wax, so honest work was sine cera — “without wax.” Scholars say this is folk etymology; sincere really comes from Latin sincerus, “pure, whole.”', 'Popular story, generally considered untrue.'],
  ['muscle', 'Latin', 'fact', 'Muscle comes from the Latin musculus, “little mouse.” To Roman eyes, a muscle rippling under the skin looked like a small mouse scurrying beneath a blanket.', ''],
  ['berserk', 'Old Norse', 'fact', 'The berserkir were Norse warriors who fought in a wild trance. Their name is usually read as “bear-shirts,” after the bearskins they were said to wear into battle — though some argue it meant “bare-shirt,” fighting without armour.', ''],
  ['disaster', 'Italy · 1500s', 'fact', 'Disastro in Italian meant “ill-starred.” When the stars were thought to steer human fate, a calamity was simply a bad alignment of the heavens — astro being the star.', ''],
  ['robot', 'Prague · 1920', 'fact', 'Robot entered the world in Karel Čapek’s 1920 play R.U.R. The word, suggested by his brother Josef, comes from the Czech robota — the forced labour peasants owed their lords.', ''],
  ['serendipity', 'England · 1754', 'fact', 'Horace Walpole coined serendipity in a letter, after a Persian fairy tale, The Three Princes of Serendip, whose heroes kept discovering things they were not looking for. Serendip was an old name for Sri Lanka.', ''],
  ['candidate', 'Rome · antiquity', 'fact', 'Romans seeking public office wore togas rubbed with chalk to look brilliantly white. They were candidati — “clothed in white” — from candidus, the same root as candid and candour.', ''],
  ['companion', 'Late Latin', 'fact', 'A companion is, quite literally, someone you share bread with: Latin com, “with,” and panis, “bread.” Company grew from the same table.', ''],
  ['mortgage', 'Old French', 'fact', 'Mortgage is Old French for a “death pledge.” The deal dies either when the debt is paid, or when the borrower fails and the land is lost.', ''],
  ['deadline', 'America · 1860s', 'fact', 'In Civil War prison camps, a deadline was a line drawn around the stockade; prisoners who crossed it could be shot. Newspapers later borrowed the word for the hour after which no story could make the paper.', ''],
  ['boycott', 'Ireland · 1880', 'fact', 'Captain Charles Boycott, a land agent in County Mayo, refused to lower rents during hard times. The whole community stopped working for him, selling to him, even speaking to him — and his name became the word.', ''],
  ['silhouette', 'France · 1759', 'fact', 'Étienne de Silhouette was a French finance minister famous for harsh cost-cutting. The usual explanation is that cheap black profile portraits were mocked as “à la Silhouette” — done on the cheap.', 'The naming is recorded; the exact reason is the usual explanation.'],
  ['tantalize', 'Greek myth', 'fact', 'Tantalus was punished by the gods to stand in water beneath fruit trees. Whenever he bent to drink, the water drew back; whenever he reached for fruit, the branches lifted away.', ''],
  ['panic', 'Greek myth', 'fact', 'Pan, the wild god of shepherds, was said to fill lonely travellers with sudden, groundless terror in the hills. That fear was panikos — “of Pan.”', ''],
  ['alibi', 'Latin', 'fact', 'Alibi is plain Latin for “elsewhere.” In court it was the defence that the accused was somewhere else when the crime took place.', ''],
  ['bankrupt', 'Italy · 1500s', 'story', 'Italian moneylenders worked at benches — banche. A popular story says that when one failed, his bench was broken: banca rotta, “broken bench.” The phrase is real; the ritual bench-smashing may be legend.', 'The phrase is recorded; the bench-breaking is a popular story.'],
  ['budget', 'Old French', 'fact', 'A bougette was a small leather bag or wallet. Britain’s Chancellor of the Exchequer was said to “open the budget” when presenting the year’s finances, and the bag became the plan.', ''],
  ['audit', 'Latin', 'fact', 'Audit comes from audire, “to hear.” Before most people could read, accounts were read aloud to officials who listened for errors — they audited.', ''],
  ['debt', 'England · 1500s', 'fact', 'Middle English spelled it dette, and nobody pronounced a b. Renaissance scholars added the silent b to make it look like Latin debitum. The spelling stuck; the sound never came.', ''],
  ['tender', 'Old French', 'fact', 'To tender is to offer, from French tendre, “to hold out.” A bid in a procurement is a tender because you are holding out an offer — and legal tender is money a creditor must accept when it is offered.', ''],
  ['procure', 'Latin', 'fact', 'Procure comes from Latin procurare — pro, “on behalf of,” and curare, “to take care of.” To procure was to look after something for someone else, long before it meant to buy.', ''],
  ['verdict', 'Latin', 'fact', 'A verdict is a vere dictum — a thing “truly said.” The jury’s word was meant to be the truth spoken aloud.', ''],
  ['testify', 'Latin', 'story', 'You may hear that Romans swore oaths while holding their private parts. It is a myth. Testify comes from testis, “witness” — literally a third person standing by.', 'Popular story, untrue.'],
  ['stoic', 'Athens · 300 BC', 'fact', 'Zeno of Citium taught in Athens under the Stoa Poikile, the Painted Porch. His followers were named after that porch: the Stoics.', ''],
  ['cynic', 'Athens · 300s BC', 'fact', 'Cynic comes from the Greek kynikos, “dog-like.” Diogenes and his followers lived roughly in public, shameless as dogs, mocking the comforts of polite society.', ''],
  ['nice', 'Middle English', 'fact', 'In the 1300s, nice meant foolish or ignorant, from Latin nescius, “not knowing.” Over centuries it drifted to fussy, then precise, then pleasant.', ''],
  ['silly', 'Old English', 'fact', 'Silly began as sælig, meaning blessed or happy. It slid to innocent, then to pitiable, then to foolish — one of English’s great downhill journeys.', ''],
  ['awful', 'Old English', 'fact', 'Awful once meant “full of awe” — worthy of deep respect or wonder. Only later did it come to mean very bad.', ''],
  ['villain', 'Latin', 'fact', 'A villanus was simply a farm worker on a Roman villa. Snobbery among the upper classes slowly turned the humble labourer into the wicked character.', ''],
  ['trivial', 'Latin', 'fact', 'A trivium was the place where three roads meet. What you heard at a crossroads was common talk — so trivial came to mean ordinary, of little importance.', ''],
  ['posh', 'England · 1900s', 'story', 'The famous tale: rich travellers to India booked shaded cabins “Port Out, Starboard Home,” stamped P.O.S.H. on their tickets. No such ticket has ever been found, and word experts consider the story false.', 'Popular story, considered untrue.'],
  ['checkmate', 'Persia', 'fact', 'Checkmate comes from the Persian shāh māt — “the king is helpless.” Chess travelled west through the Arab world, carrying the phrase with it.', ''],
  ['jeopardy', 'Old French', 'fact', 'Jeu parti meant a “divided game” — a position so evenly balanced that the outcome could go either way. To be in jeopardy is to have your fate hanging in that balance.', ''],
  ['sinister', 'Latin', 'fact', 'Sinister is Latin for “left.” Omens seen on the left were thought unlucky, so the left-hand side became the ominous one — while dexter, the right, gave us dexterity.', ''],
  ['lunatic', 'Latin', 'fact', 'From luna, the moon. People long believed that the phases of the moon could drive a person mad.', ''],
  ['influenza', 'Italy · 1700s', 'fact', 'Italians blamed sudden epidemics on the influence of the stars — influenza. English borrowed the word in 1743 during an outbreak, and later shortened it to flu.', ''],
  ['window', 'Old Norse', 'fact', 'A window was a vindauga — a “wind eye.” In Viking homes it was a hole in the roof that let out smoke and let in wind.', ''],
  ['goodbye', 'England · 1500s', 'fact', 'Goodbye is a squeezed form of “God be with ye.” Over time, “God” drifted into “good,” perhaps under the influence of good day and good night.', ''],
  ['sarcasm', 'Greek', 'fact', 'Sarcasm comes from the Greek sarkazein, “to tear flesh” like a dog. A sarcastic remark was one that bit.', ''],
  ['lexicon', 'Greek', 'fact', 'Lexicon comes from the Greek lexikon biblion — “a book of words,” from lexis, “word, speech.” You are building one now.', ''],
  ['lucent', 'Latin', 'fact', 'Lucent comes from Latin lucere, “to shine” — the same family as lucid, translucent and elucidate. Words that make things clear.', ''],
  ['treasury', 'Greek', 'fact', 'Treasure comes, through Latin and French, from the Greek thēsauros — a storehouse. The same word gave English thesaurus: a treasure-house of words.', ''],
  ['nostalgia', 'Switzerland · 1688', 'fact', 'A Swiss medical student, Johannes Hofer, coined nostalgia for the deadly homesickness he saw in soldiers serving abroad: Greek nostos, “homecoming,” and algos, “pain.”', ''],
  ['gossip', 'Old English', 'fact', 'A godsibb was a godparent — someone “related in God.” Godparents were close family friends, and the easy talk among them gave the word its modern meaning.', ''],
  ['curfew', 'Norman England', 'fact', 'From the Old French couvre-feu, “cover the fire.” A bell rang each evening telling households to bank their hearths for the night, to prevent fires in wooden towns.', ''],
  ['shampoo', 'India · 1700s', 'fact', 'From the Hindi chāmpo, “press, knead.” It meant a massage, until Sake Dean Mahomed opened a famous shampooing bath house in Brighton, and the word moved to washing the hair.', ''],
  ['bedlam', 'London · 1400s', 'fact', 'The Bethlem Royal Hospital in London was one of the first asylums. Its name, worn down to Bedlam, came to mean wild confusion and uproar.', ''],
  ['maverick', 'Texas · 1800s', 'fact', 'Samuel Maverick, a Texas lawyer and landowner, did not brand his cattle. Unbranded strays came to be called mavericks — and so did anyone who refused to wear the herd’s mark.', ''],
  ['sandwich', 'England · 1700s', 'story', 'John Montagu, 4th Earl of Sandwich, gave his name to bread around meat. The legend says he ate it so he would never leave the gambling table; his biographer suggests it was more likely at his desk.', 'The Earl is fact; the gambling reason is a popular story.'],
  ['eloquent', 'Latin', 'fact', 'Eloquent comes from eloqui, “to speak out” — e, “out,” and loqui, “to speak.” Its relatives include loquacious, colloquial and soliloquy.', ''],
  ['assassin', 'Persia · 1100s', 'story', 'Assassin comes from the Arabic name for a secretive Nizari order. Their enemies claimed they acted under hashish — hashishiyyin. Modern historians think that was mostly slander.', 'The Arabic origin is fact; the hashish story is disputed.'],
  ['hazard', 'Old French', 'story', 'Hazard first meant a game of dice. It is often traced to the Arabic az-zahr, “the die,” though that link is uncertain.', 'Origin uncertain.'],
  ['juggernaut', 'India', 'fact', 'Jagannath is a form of the Hindu god Vishnu, whose vast temple chariot is pulled through Puri each year. European travellers wrote exaggerated tales of devotees crushed beneath it, and the name became any unstoppable force.', ''],
  ['nemesis', 'Greek myth', 'fact', 'Nemesis was the Greek goddess of retribution, who punished arrogance and undeserved good fortune. Your nemesis is the one who will bring you down.', ''],
  ['sophisticated', 'Greek', 'fact', 'Sophisticated first meant “adulterated” or “corrupted” — like a watered-down wine — from the sophists, teachers accused of clever, misleading arguments. Only in the 1900s did it become a compliment.', ''],
  ['malaria', 'Italy · 1700s', 'fact', 'Mal’aria is Italian for “bad air.” People believed the fever rose from the foul air of marshes; the real culprit, the mosquito, was not identified until 1897.', '']
];

/* The Arena: ten titles per ground, earned 100 points at a time */
LX.ARENA_TITLES = {
 "All categories": [
  "Hedge Wizard of Words",
  "Apprentice Spellbinder",
  "Conjurer of Clauses",
  "Thesaurus Rex",
  "Vocabularian Warlock",
  "Lexicomancer",
  "Sorcerer Supreme of Syntax",
  "Archmage of Articulation",
  "Grand Enchanter of the English Tongue",
  "The Silver-Tongued Sorcerer"
 ],
 "Literary": [
  "Margin Scribbler",
  "Dog-Ear Delinquent",
  "Bookmark Bandit",
  "Plot-Twist Prophet",
  "Purveyor of Purple Prose",
  "Metaphor Magnate",
  "Keeper of the Unreliable Narrator",
  "Duke of the Denouement",
  "Laureate of the Lamplight",
  "The Unputdownable"
 ],
 "Business": [
  "Synergy Survivor",
  "Intern of Incentives",
  "Spreadsheet Whisperer",
  "Quarterly Report Romantic",
  "Merchant of Memos",
  "Viscount of Venture",
  "Margin Maestro",
  "Baron of Bottom Lines",
  "Tycoon of Terms",
  "Chairman of the Wordroom"
 ],
 "Legal": [
  "Loophole Hunter",
  "Connoisseur of Hearsay",
  "Reader of the Fine Print (All of It)",
  "Objection Sustainer",
  "Barrister of Banter",
  "Counsel for the Defence of Words",
  "Notary of Nuance",
  "Magistrate of the Mot Juste",
  "His Honour of Heretofore",
  "Lord Chief Justice of the Lexicon"
 ],
 "Medical": [
  "Bedside Vocabularist",
  "Prescription Decoder",
  "Hypochondriac’s Hero",
  "Resident of Rhetoric",
  "Surgeon of Syllables",
  "Doctor of Diction (Honorary)",
  "Chief Resident of Big Words",
  "Specialist in Sesquipedalian Symptoms",
  "Consultant of the Clinical Tongue",
  "The Physician of Phrases"
 ],
 "Science": [
  "Lab-Coat Lexicographer",
  "Beaker Botherer",
  "Haver of Hypotheses",
  "Peer-Reviewed Talker",
  "Professor of Particles",
  "Quantum Quipster",
  "Fellow of the Royal Society of Words",
  "Theorist of Everything Said",
  "Laureate of the Laboratory",
  "Nobel-Adjacent Genius"
 ],
 "Everyday": [
  "Small-Talk Samurai",
  "Grocery-List Laureate",
  "Commute Conversationalist",
  "Elevator Pitch Perfect",
  "Breakfast-Table Philosopher",
  "Neighbourhood Wordsmith",
  "Barbershop Orator",
  "Sage of the Sari-Sari Store",
  "Master of Mundane Magnificence",
  "The People’s Poet"
 ],
 "Ornate": [
  "Baroque and Proud",
  "Fond of Flourishes",
  "Apprentice Grandiloquist",
  "Curator of Curlicues",
  "The Gilded Tongue",
  "Sesquipedalian Sovereign",
  "Marquis of Magniloquence",
  "Archduke of Ornamentation",
  "Lord High Grandiloquent",
  "His Most Rococo Excellency"
 ],
 "Whimsical": [
  "Gigglemonger",
  "Purveyor of Piffle",
  "Squire of Shenanigans",
  "Professor of Poppycock",
  "Baron von Bamboozle",
  "Knight of the Kerfuffle",
  "Earl of Hullabaloo",
  "Archduke of Balderdash",
  "Supreme Codswallop Commissioner",
  "Grand Vizier of Gobbledygook"
 ]
};
