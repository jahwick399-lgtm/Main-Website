// All vendor data — served only after Stripe payment verification

const electronics = [
  // Resource sheets
  { name: 'Full Electronics Catalog',  price: null, url: 'https://docs.google.com/spreadsheets/d/1a3R_v5FiirNsIWx6JJrVCaWPUOj1wFD2vhCLilk1hAg/htmlview', isSheet: true },
  { name: 'Full Vendor Spreadsheet',   price: null, url: 'https://docs.google.com/spreadsheets/d/1bEDyU7BJ8sNstmoXJa_IPb4FR_9uTFl6-hepzlt0Ad4/edit?gid=595104429', isSheet: true },
  // Phones
  { name: 'iPhone', price: '$10', url: 'https://usfans.com/product/3/7722115604?ref=KRYFUS' },
  { name: 'iPhone', price: '$14', url: 'https://usfans.com/product/3/7719050755?ref=KRYFUS' },
  { name: 'iPhone 16 Plus', price: '$208', url: 'https://usfans.com/product/3/7722052392?ref=KRYFUS' },
  { name: 'Samsung S25', price: '$148', url: 'https://usfans.com/product/3/7722046568?ref=KRYFUS' },
  { name: 'Samsung S24', price: '$148', url: 'https://usfans.com/product/3/7722015174?ref=KRYFUS' },
  // Earbuds & Headphones
  { name: 'AirPods', price: '$41', url: 'https://usfans.com/product/3/7722078124?ref=KRYFUS' },
  { name: 'AirPods', price: '$215', url: 'https://usfans.com/product/3/7722115612?ref=KRYFUS' },
  { name: 'Wired Earphones', price: '$7', url: 'https://usfans.com/product/3/7719121715?ref=KRYFUS' },
  { name: 'Max Earphones', price: '$72', url: 'https://usfans.com/product/3/7719064363?ref=KRYFUS' },
  { name: 'Bose Ultra Open Earbuds', price: '$22', url: 'https://usfans.com/product/3/7722046570?ref=KRYFUS' },
  { name: 'Samsung Buds 3 Pro', price: '$20', url: 'https://usfans.com/product/3/7722099768?ref=KRYFUS' },
  { name: 'Samsung Buds 2 Pro', price: '$26', url: 'https://usfans.com/product/3/7721997398?ref=KRYFUS' },
  // Speakers
  { name: 'JBL Flip 5', price: '$21', url: 'https://usfans.com/product/3/7718977567?ref=KRYFUS' },
  { name: 'JBL Flip 6', price: '$24', url: 'https://usfans.com/product/3/7719109765?ref=KRYFUS' },
  { name: 'JBL Pulse', price: '$24', url: 'https://usfans.com/product/3/7722085972?ref=KRYFUS' },
  { name: 'JBL Pulse 6', price: '$37', url: 'https://usfans.com/product/3/7722089886?ref=KRYFUS' },
  { name: 'Bose BFlex', price: '$40', url: 'https://usfans.com/product/3/7719052691?ref=KRYFUS' },
  // Smart Watches
  { name: 'Smart Watch', price: '$7', url: 'https://usfans.com/product/3/7722023114?ref=KRYFUS' },
  { name: 'Smart Watch', price: '$31', url: 'https://usfans.com/product/3/7719017201?ref=KRYFUS' },
  { name: 'Smart Watch', price: '$41', url: 'https://usfans.com/product/3/7719107821?ref=KRYFUS' },
  // Phone Cases
  { name: 'Phone Case', price: '$8', url: 'https://usfans.com/product/3/7719076199?ref=KRYFUS' },
  { name: 'Phone Case', price: '$8', url: 'https://usfans.com/product/3/7719121721?ref=KRYFUS' },
  { name: 'Phone Case', price: '$14', url: 'https://usfans.com/product/3/7722078136?ref=KRYFUS' },
  { name: 'Phone Case', price: '$14', url: 'https://usfans.com/product/3/7740212963?ref=KRYFUS' },
  { name: 'Phone Case', price: '$31', url: 'https://usfans.com/product/3/7722054366?ref=KRYFUS' },
  // Dyson
  { name: 'Dyson HD 16', price: '$120', url: 'https://usfans.com/product/3/7721989378?ref=KRYFUS' },
  { name: 'Dyson HD 07', price: '$92', url: 'https://usfans.com/product/3/7722036980?ref=KRYFUS' },
  { name: 'Dyson HD 15', price: '$118', url: 'https://usfans.com/product/3/7722044614?ref=KRYFUS' },
  { name: 'Dyson HD 08', price: '$34', url: 'https://usfans.com/product/3/7719052693?ref=KRYFUS' },
  { name: 'Dyson HT 01', price: '$92', url: 'https://usfans.com/product/3/7719091943?ref=KRYFUS' },
  { name: 'Dyson 03', price: '$92', url: 'https://usfans.com/product/3/7722097826?ref=KRYFUS' },
  { name: 'Dyson Baby Electric Clippers', price: '$110', url: 'https://usfans.com/product/3/7719013277?ref=KRYFUS' },
  { name: 'Dyson Comb', price: '$31', url: 'https://usfans.com/product/3/7722054366?ref=KRYFUS' },
]

const fragrance = [
  { name: 'Creed', price: null, url: 'https://usfans.com/product/3/7719011247?ref=KRYFUS' },
  { name: 'Tom Ford', price: null, url: 'https://usfans.com/product/3/7722009158?ref=KRYFUS' },
  { name: 'Versace Eros', price: null, url: 'https://usfans.com/product/3/7702706002?ref=KRYFUS' },
  { name: 'Bleu de Chanel', price: null, url: 'https://usfans.com/product/3/7722070086?ref=KRYFUS' },
  { name: 'Valentino', price: null, url: 'https://usfans.com/product/3/7718995399?ref=KRYFUS' },
  { name: 'Gucci', price: null, url: 'https://usfans.com/product/3/7719038955?ref=KRYFUS' },
  { name: 'Dior Perfume', price: null, url: 'https://usfans.com/product/3/7719109711?ref=KRYFUS' },
  { name: 'Dior Sauvage', price: null, url: 'https://usfans.com/product/3/7719003323?ref=KRYFUS' },
]

const hoodies = [
  { name: 'Sp5der', price: null, url: 'https://usfans.com/product/3/7704009552?ref=KRYFUS' },
  { name: 'Sp5der', price: null, url: 'https://usfans.com/product/3/7704031368?ref=KRYFUS' },
  { name: 'Sp5der', price: null, url: 'https://usfans.com/product/3/7722046320?ref=KRYFUS' },
  { name: 'Sp5der', price: null, url: 'https://usfans.com/product/3/7721947552?ref=KRYFUS' },
  { name: 'Chrome Hearts', price: null, url: 'https://usfans.com/product/3/7718963571?ref=KRYFUS' },
  { name: 'Hellstar', price: null, url: 'https://usfans.com/product/3/7722012850?ref=KRYFUS' },
  { name: 'Bape', price: null, url: 'https://usfans.com/product/3/7719007161?ref=KRYFUS' },
  { name: 'Essentials', price: null, url: 'https://usfans.com/product/3/7719083847?ref=KRYFUS' },
  { name: 'Essentials', price: null, url: 'https://usfans.com/product/3/7719022853?ref=KRYFUS' },
  { name: 'Essentials', price: null, url: 'https://usfans.com/product/3/7722028754?ref=KRYFUS' },
  { name: 'Denim Tears', price: null, url: 'https://usfans.com/product/3/7722077746?ref=KRYFUS' },
  { name: 'Denim Tears', price: null, url: 'https://usfans.com/product/3/7719016889?ref=KRYFUS' },
  { name: 'Denim Tears', price: null, url: 'https://usfans.com/product/3/7722073848?ref=KRYFUS' },
  { name: 'North Face', price: null, url: 'https://usfans.com/product/3/7719072127?ref=KRYFUS' },
  { name: 'North Face', price: null, url: 'https://usfans.com/product/3/7719064163?ref=KRYFUS' },
  { name: 'North Face', price: null, url: 'https://usfans.com/product/3/7722069952?ref=KRYFUS' },
  { name: 'Moncler', price: null, url: 'https://usfans.com/product/3/7719079885?ref=KRYFUS' },
  { name: 'Trapstar', price: null, url: 'https://usfans.com/product/3/7722087656?ref=KRYFUS' },
]

const shoes = [
  { name: 'Yeezys', price: null, url: 'https://usfans.com/product/3/7718989217?ref=KRYFUS' },
  { name: 'New Balance 9060', price: null, url: 'https://usfans.com/product/3/7719062003?ref=KRYFUS' },
  { name: 'Jordan 4', price: null, url: 'https://usfans.com/product/3/7722016708?ref=KRYFUS' },
  { name: 'Air Force 1s', price: null, url: 'https://usfans.com/product/3/7722053942?ref=KRYFUS' },
  { name: 'Panda Dunks Low', price: null, url: 'https://usfans.com/product/3/7718969299?ref=KRYFUS' },
  { name: 'Yeezy 350', price: null, url: 'https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7473253975&affcode=DR88KK' },
  { name: 'Balenciaga Track', price: null, url: 'https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7475167760&affcode=DR88KK' },
  { name: 'Fuzzy Slides', price: null, url: 'https://usfans.com/product/3/7719016845?ref=KRYFUS' },
  { name: 'Gucci Slides', price: null, url: 'https://usfans.com/product/3/7721998914?ref=KRYFUS' },
  { name: 'Bapesta', price: null, url: 'https://usfans.com/product/3/7722028658?ref=KRYFUS' },
  { name: 'Bapesta', price: null, url: 'https://usfans.com/product/3/7722052020?ref=KRYFUS' },
  { name: 'LV Trainer', price: null, url: 'https://usfans.com/product/3/7721963342?ref=KRYFUS' },
  { name: 'Lanvin Curb', price: null, url: 'https://usfans.com/product/3/7722001438?ref=KRYFUS' },
  { name: 'Mason Mihara', price: null, url: 'https://usfans.com/product/3/7742414919?ref=KRYFUS' },
]

const jewelry = [
  { name: 'LV Slim Bracelet',  price: null, url: 'https://usfans.com/product/3/7722032868?ref=KRYFUS' },
  { name: 'Van Cleef Bracelet', price: null, url: 'https://usfans.com/product/3/7719088065?ref=KRYFUS' },
  { name: 'Van Cleef Necklace', price: null, url: 'https://usfans.com/product/3/7719056589?ref=KRYFUS' },
]

const watches = [
  // Casio
  { name: 'Casio', price: '$34', url: 'https://usfans.com/product/3/7721979254?ref=KRYFUS' },
  { name: 'Casio', price: '$44', url: 'https://usfans.com/product/3/7722020722?ref=KRYFUS' },
  { name: 'Casio CA-110MC-1A', price: '$17', url: 'https://usfans.com/product/3/7719067947?ref=KRYFUS' },
  { name: 'Casio BABY-G', price: '$18', url: 'https://usfans.com/product/3/7719036661?ref=KRYFUS' },
  { name: 'Casio GM-S6600G-7', price: '$32', url: 'https://usfans.com/product/3/7722053992?ref=KRYFUS' },
  { name: 'Casio GMW-B6000D-1', price: '$36', url: 'https://usfans.com/product/3/7722046206?ref=KRYFUS' },
  { name: 'Casio GA-110', price: '$17', url: 'https://usfans.com/product/3/7718965399?ref=KRYFUS' },
  // Tissot
  { name: 'Tissot', price: '$20', url: 'https://usfans.com/product/3/7722057950?ref=KRYFUS' },
  { name: 'Tissot', price: '$31', url: 'https://usfans.com/product/3/7722010822?ref=KRYFUS' },
  { name: 'Tissot', price: '$49', url: 'https://usfans.com/product/3/7722046208?ref=KRYFUS' },
  { name: 'Tissot', price: '$55', url: 'https://usfans.com/product/3/7721971342?ref=KRYFUS' },
  { name: 'Tissot', price: '$68', url: 'https://usfans.com/product/3/7719058085?ref=KRYFUS' },
  { name: 'Tissot', price: '$68', url: 'https://usfans.com/product/3/7721961354?ref=KRYFUS' },
  { name: 'Tissot', price: '$73', url: 'https://usfans.com/product/3/7719008937?ref=KRYFUS' },
  { name: 'Tissot PRX', price: '$80', url: 'https://usfans.com/product/3/7719016859?ref=KRYFUS' },
  { name: 'Tissot PRX 40', price: '$87', url: 'https://usfans.com/product/3/7719007051?ref=KRYFUS' },
  { name: 'Tissot Bellissima Small Lady', price: '$94', url: 'https://usfans.com/product/3/7721947446?ref=KRYFUS' },
  { name: 'Tissot PRX Arctic Sky', price: '$111', url: 'https://usfans.com/product/3/7722077720?ref=KRYFUS' },
  { name: 'Tissot PRX II', price: '$120', url: 'https://usfans.com/product/3/7719016865?ref=KRYFUS' },
  { name: 'Tissot Chemin Des Tourelles', price: '$79', url: 'https://usfans.com/product/3/7722067858?ref=KRYFUS' },
  { name: 'Tissot Chemin Des Tourelles', price: '$84', url: 'https://usfans.com/product/3/7722040412?ref=KRYFUS' },
  { name: 'Tissot PRX Powermatic 80', price: '$283', url: 'https://usfans.com/product/3/7719042571?ref=KRYFUS' },
  // Rolex
  { name: 'Rolex', price: '$49', url: 'https://usfans.com/product/3/7718989253?ref=KRYFUS' },
  { name: 'Rolex', price: '$55', url: 'https://usfans.com/product/3/7719007053?ref=KRYFUS' },
  { name: 'Rolex', price: '$60', url: 'https://usfans.com/product/3/7722022754?ref=KRYFUS' },
  { name: 'Rolex', price: '$65', url: 'https://usfans.com/product/3/7721947448?ref=KRYFUS' },
  { name: 'Rolex', price: '$70', url: 'https://usfans.com/product/3/7719012911?ref=KRYFUS' },
  { name: 'Rolex', price: '$75', url: 'https://usfans.com/product/3/7718951501?ref=KRYFUS' },
  { name: 'Rolex', price: '$80', url: 'https://usfans.com/product/3/7721949536?ref=KRYFUS' },
  { name: 'Rolex', price: '$85', url: 'https://usfans.com/product/3/7721985114?ref=KRYFUS' },
  { name: 'Rolex', price: '$97', url: 'https://usfans.com/product/3/7722065824?ref=KRYFUS' },
  { name: 'Rolex Daytona', price: '$79', url: 'https://usfans.com/product/3/7719052329?ref=KRYFUS' },
  { name: 'Rolex Daytona', price: '$200', url: 'https://usfans.com/product/3/7721979252?ref=KRYFUS' },
  { name: 'Rolex Daytona', price: '$246', url: 'https://usfans.com/product/3/7719069949?ref=KRYFUS' },
  { name: 'Rolex GMT-Master II', price: null, url: 'https://usfans.com/product/3/7721989026?ref=KRYFUS' },
  { name: 'Rolex GMT-Master II', price: null, url: 'https://usfans.com/product/3/7722036608?ref=KRYFUS' },
  { name: 'Rolex Datejust', price: null, url: 'https://usfans.com/product/3/7722024670?ref=KRYFUS' },
  { name: 'Rolex Oyster Perpetual', price: null, url: 'https://usfans.com/product/3/7719054243?ref=KRYFUS' },
  { name: 'Rolex Oyster Perpetual', price: null, url: 'https://usfans.com/product/3/7719032757?ref=KRYFUS' },
  { name: 'Rolex Submariner', price: null, url: 'https://usfans.com/product/3/7721967242?ref=KRYFUS' },
  { name: 'Rolex Explorer II', price: null, url: 'https://usfans.com/product/3/7722026666?ref=KRYFUS' },
  { name: 'Rolex Deepsea', price: null, url: 'https://usfans.com/product/3/7721945488?ref=KRYFUS' },
  // Omega
  { name: 'Omega', price: '$29', url: 'https://usfans.com/product/3/7719036663?ref=KRYFUS' },
  { name: 'Omega', price: '$45', url: 'https://usfans.com/product/3/7718967387?ref=KRYFUS' },
  { name: 'Omega', price: '$60', url: 'https://usfans.com/product/3/7722048086?ref=KRYFUS' },
  { name: 'Omega', price: '$75', url: 'https://usfans.com/product/3/7719067943?ref=KRYFUS' },
  { name: 'Omega', price: '$85', url: 'https://usfans.com/product/3/7722044246?ref=KRYFUS' },
  { name: 'Omega', price: '$95', url: 'https://usfans.com/product/3/7722008854?ref=KRYFUS' },
  { name: 'Omega Aqua Terra 150M', price: '$84', url: 'https://usfans.com/product/3/7719004977?ref=KRYFUS' },
  // Longines
  { name: 'Longines Conquest', price: '$112', url: 'https://usfans.com/product/3/7722065822?ref=KRYFUS' },
  { name: 'Longines HydroConquest', price: '$151', url: 'https://usfans.com/product/3/7719087723?ref=KRYFUS' },
  { name: 'Longines HydroConquest', price: '$156', url: 'https://usfans.com/product/3/7719020817?ref=KRYFUS' },
  { name: 'Longines Master Collection', price: '$431', url: 'https://usfans.com/product/3/7722002914?ref=KRYFUS' },
  // Audemars Piguet
  { name: 'AP Royal Oak', price: '$63', url: 'https://usfans.com/product/3/7722006866?ref=KRYFUS' },
  { name: 'AP Royal Oak', price: '$100', url: 'https://usfans.com/product/3/7718975405?ref=KRYFUS' },
  { name: 'AP Royal Oak', price: '$120', url: 'https://usfans.com/product/3/7721973258?ref=KRYFUS' },
  { name: 'AP Royal Oak', price: '$139', url: 'https://usfans.com/product/3/7719063989?ref=KRYFUS' },
  // Patek Philippe
  { name: 'Patek Philippe Nautilus', price: '$60', url: 'https://usfans.com/product/3/7718971353?ref=KRYFUS' },
  { name: 'Patek Philippe', price: '$80', url: 'https://usfans.com/product/3/7722022758?ref=KRYFUS' },
  { name: 'Patek Philippe Aquanaut', price: '$97', url: 'https://usfans.com/product/3/7721953494?ref=KRYFUS' },
  // Vacheron Constantin
  { name: 'Vacheron Constantin', price: '$78', url: 'https://usfans.com/product/3/7722057948?ref=KRYFUS' },
  { name: 'Vacheron Constantin', price: '$147', url: 'https://usfans.com/product/3/7721994978?ref=KRYFUS' },
  // IWC
  { name: 'IWC', price: '$68', url: 'https://usfans.com/product/3/7722046210?ref=KRYFUS' },
  { name: 'IWC', price: '$78', url: 'https://usfans.com/product/3/7719004975?ref=KRYFUS' },
]

module.exports = {
  electronics,
  fragrance,
  hoodies,
  clothing: hoodies,
  shoes,
  jewelry,
  watches,
}
