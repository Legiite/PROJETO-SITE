// Perfil e galeria centralizados no estilo do template de artistas adaptado.
const Data = {
  WebsiteTitle: 'Ghostfolio — Ghost Studio',
  HeaderTitle: 'GHOSTFOLIO',
  name: 'Ghost Studio',
  handle: 'ghoststudio',
  role: 'Designer gráfico · Artista digital',
  bio: 'Transformando ideias em identidades visuais.',
  avatar: '',
  avatarMediaId: '',
  avatarUrl: '',
  backgroundMediaId: '',
  backgroundUrl: '',
  backgroundRemoteUrl: 'https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyemM2OXZ3enNlcHdiMXI1em95OHBsaDhzOG1jMmtwenlyaHRsN2Y0MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pmONR25D6YmkI2qHVg/giphy.gif',
  commissionText: 'Comissões abertas',
  quoteChannel: 'email',
  quoteButtonText: 'Solicitar orçamento',
  quoteNotice: '',
  layoutOrder: ['header','avatar','name','handle','role','bio','editButton','musicShortcut','worksShortcut','socials','music','commission','quote','quoteDestination','portfolio','footer'],
  layoutPositions: {
    header:{column:0,row:0,span:12},avatar:{column:4,row:1,span:4},name:{column:3,row:2,span:6},handle:{column:4,row:3,span:4},role:{column:3,row:4,span:6},bio:{column:2,row:5,span:8},editButton:{column:4,row:6,span:4},musicShortcut:{column:4,row:7,span:4},worksShortcut:{column:4,row:8,span:4},socials:{column:2,row:9,span:8},music:{column:3,row:10,span:6},commission:{column:4,row:11,span:4},quote:{column:3,row:12,span:6},quoteDestination:{column:3,row:13,span:6},portfolio:{column:0,row:14,span:12},footer:{column:0,row:15,span:12}
  },
  email: 'oi@ghoststudio.art',
  socials: {
    twitch: 'https://www.twitch.tv/ghoststudio',
    instagram: 'https://www.instagram.com/ghoststudio',
    tiktok: 'https://www.tiktok.com/@ghoststudio',
    discord: '',
    email: 'oi@ghoststudio.art'
  },
  socialNames: {
    twitch: '@ghoststudio',
    instagram: '@ghoststudio',
    tiktok: '@ghoststudio',
    discord: '@ghoststudio',
    email: 'oi@ghoststudio.art'
  },
  socialIcons: {},
  sections: {
    header: true,
    avatar: true,
    intro: true,
    name: true,
    handle: true,
    role: true,
    bio: true,
    socials: true,
    music: true,
    commission: true,
    quote: true,
    quoteDestination: false,
    shortcuts: true,
    editButton: true,
    musicShortcut: true,
    worksShortcut: true,
    social_twitch: true,
    social_instagram: true,
    social_tiktok: true,
    social_discord: true,
    social_email: true,
    portfolio: true,
    footer: true
  },
  design: {
    background: '#0b0710',
    surface: '#150d1e',
    accent: '#c041ff',
    secondary: '#b9ff4a',
    text: '#f8f3fa',
    palette: 'ghost',
    font: 'system',
    columns: 4,
    radius: 22
  },
  musicMediaId: '',
  musicName: '',
  musicUrl: '',
  works: [
    {id:'ghost',title:'Stream Offline — Ghost',category:'Layouts',style:'ghost',text:'STREAM\nOFFLINE',emoji:'👻'},
    {id:'bee',title:'Stream começando — Bee',category:'Layouts',style:'bee',text:'STREAM\nINICIANDO',emoji:'🐝'},
    {id:'horror',title:'Stream Offline — Horror',category:'Layouts',style:'horror',text:'STREAM\nOFFLINE',emoji:'💀'},
    {id:'emotes',title:'Pack de emotes',category:'Emotes',style:'emotes',emoji:'',text:''},
    {id:'cyber',title:'Stream iniciando — Cyber',category:'Layouts',style:'cyber',text:'STREAM\nINICIANDO',emoji:'🎧'},
    {id:'logo',title:'Identidade Ghost Studio',category:'Logotipos',style:'logo',text:'GHOST\nSTUDIO',emoji:'👻'},
    {id:'ghost-gif-demo',title:'Fantasma animado — exemplo GIF',category:'Animações',style:'uploaded',remoteUrl:'https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyNm44YzFhenhyeDE3bmRmc3RpbHJyYXdvZmF5MzI0bHFuZmtsaTlnNCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/88hQl9Z5WVNTE7QBEV/source.gif',kind:'image',text:'',emoji:''}
  ],
  FooterText: 'Criado com Ghostfolio'
};

export default Data;

