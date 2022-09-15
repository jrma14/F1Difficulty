/** @type {import('tailwindcss').Config} */


const withMT = require("@material-tailwind/html/utils/withMT");
const { urlencoded } = require('express');

module.exports = withMT({
  mode:'jit',
  content: ["./public/**/*.html"],
  theme: {
    colors: {
      'base':'#5DD1F5',
      'blue':'#4994DE',
      'bluepurple':'#537BFA',
      'bluegreen':'#49DED9',
      'green':'#53FAC6',
      'black':'#000000',
      'white':'#FFFFFF',
      'grey':'#2A2A2A'
    },
    extend: {
      backgroundImage: {
        'world-map':"url('/img/world-map-removebg.png')"
      },
      invert: {
        100: '1'
      }
    },
  },
  plugins: [],
})