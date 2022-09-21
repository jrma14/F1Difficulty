module.exports =
{
  mode: 'jit',
  content: ["./public/**/*.html", "./protected/**/*.html", "./protected/**/*.ejs", './public/*.ejs','*.js'],
  theme: {
    colors: {
      // 'base': '#5DD1F5',
      // 'blue': '#4994DE',
      // 'bluepurple': '#537BFA',
      // 'bluegreen': '#49DED9',
      // 'green': '#53FAC6',
      // 'black': '#000000',
      // 'white': '#FFFFFF',
      // 'grey': '#2A2A2A',
      // 'pink': '#F8C8DC'
    },
    extend: {
      backgroundImage: {
        'world-map': "url('/img/world-map-removebg.png')"
      },
      invert: {
        100: '1'
      }
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
      {
        mytheme: {
          "primary": "#5c95ff",         
          "secondary": "#e91e63",                   
          "accent": "#a8dcd9",                   
          "neutral": "#191716",                   
          "base-100": "#fdf7fa",                   
          "info": "#3ABFF8",                   
          "success": "#36D399",                   
          "warning": "#FBBD23",                   
          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}