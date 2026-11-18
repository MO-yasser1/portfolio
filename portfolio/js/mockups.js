/**
 * mockups.js — يرسم نماذج الأجهزة (Mockups) لكروت المشاريع.
 * ملف داخلي: لا تحتاج لتعديله. لتغيير صورة مشروع عدّل 'image' في projects.js.
 */
(function () {
  'use strict';

  /* QR بسيط ثابت (9x9) مع مربعات الزوايا */
  function qr() {
    var size = 9, seed = 7, cells = '';
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function finder(r, c) {
      return (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
    }
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        var on = finder(r, c) ? !(r % 3 === 1 && c % 3 === 1 && false) : rnd() > 0.48;
        cells += '<span' + (on ? '' : ' class="off"') + '></span>';
      }
    }
    return '<div class="qr-card" aria-hidden="true"><div>' + cells + '</div></div>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  var item = function (cls) {
    return '<div class="ui-menu-item"><i class="ui-img ' + cls + '"></i><div class="lines"><span class="sk h w70"></span><span class="sk w40"></span></div><i class="ui-price"></i></div>';
  };

  var T = {
    /* منيو على موبايل + كارت QR */
    menu: function () {
      return '' +
        '<div class="dev dev-phone"><div class="dev-phone-screen">' +
          '<div class="ui ui-phone" style="--scroll:-38%">' +
            '<div class="ui-row"><span class="sk h w50"></span><span class="sk w20" style="margin-inline-start:auto"></span></div>' +
            '<div class="ui-pills"><i></i><i></i><i></i><i></i></div>' +
            '<div class="ui-img" style="height:74px"></div>' +
            item('a') + item('b') + item('c') + item('a') + item('b') + item('c') + item('a') +
          '</div>' +
          '<div class="ui-wa"><i></i><b></b></div>' +
        '</div></div>' + qr();
    },

    /* موقع شركة على متصفح */
    website: function () {
      return '' +
        '<div class="dev dev-browser"><div class="dev-bar"><i></i><i></i><i></i><b></b></div>' +
        '<div class="dev-screen"><div class="ui" style="--scroll:-40%">' +
          '<div class="ui-row" style="justify-content:space-between"><span class="sk h w20 t"></span><span class="ui-row" style="gap:10px"><i class="sk w20" style="width:26px"></i><i class="sk" style="width:26px"></i><i class="sk" style="width:26px"></i></span></div>' +
          '<div class="ui-grid2" style="align-items:center;margin-block:6px">' +
            '<div style="display:grid;gap:9px"><span class="sk xl w100"></span><span class="sk xl w70"></span><span class="sk w80"></span><span class="sk w60"></span><span class="ui-btn sm"></span></div>' +
            '<div class="ui-img" style="height:96px"></div>' +
          '</div>' +
          '<div class="ui-grid3">' +
            '<div class="ui-card"><i class="ui-img a" style="height:44px"></i><span class="sk h w70"></span><span class="sk w100"></span><span class="sk w50"></span></div>' +
            '<div class="ui-card"><i class="ui-img b" style="height:44px"></i><span class="sk h w70"></span><span class="sk w100"></span><span class="sk w50"></span></div>' +
            '<div class="ui-card"><i class="ui-img c" style="height:44px"></i><span class="sk h w70"></span><span class="sk w100"></span><span class="sk w50"></span></div>' +
          '</div>' +
          '<div class="ui-grid2" style="margin-top:6px">' +
            '<div class="ui-img c" style="height:80px"></div>' +
            '<div style="display:grid;gap:9px;align-content:center"><span class="sk h w60 t"></span><span class="sk w100"></span><span class="sk w100"></span><span class="sk w70"></span></div>' +
          '</div>' +
          '<div class="ui-card" style="grid-template-columns:1fr auto;align-items:center"><div style="display:grid;gap:7px"><span class="sk h w50"></span><span class="sk w70"></span></div><span class="ui-btn" style="width:70px"></span></div>' +
        '</div></div></div>';
    },

    /* لوحة تحكم مبيعات على متصفح */
    dashboard: function () {
      var rows = '';
      for (var i = 0; i < 6; i++) {
        rows += '<div class="tr"><span class="sk w100"></span><span class="sk w' + (i % 2 ? '60' : '80') + '"></span><i class="dot"></i></div>';
      }
      return '' +
        '<div class="dev dark dev-browser"><div class="dev-bar"><i></i><i></i><i></i><b></b></div>' +
        '<div class="dev-screen"><div class="ui-dash">' +
          '<div class="ui-side"><i></i><i></i><i></i><i></i></div>' +
          '<div class="ui-main">' +
            '<div class="ui-grid3">' +
              '<div class="ui-card"><span class="sk w50"></span><span class="sk xl w70 t"></span></div>' +
              '<div class="ui-card"><span class="sk w50"></span><span class="sk xl w60 o"></span></div>' +
              '<div class="ui-card"><span class="sk w50"></span><span class="sk xl w80 t"></span></div>' +
            '</div>' +
            '<div class="ui-card" style="padding:0"><div class="ui-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +
            '<div class="ui-card ui-table" style="padding:4px 10px">' + rows + '</div>' +
          '</div>' +
        '</div></div></div>';
    }
  };

  /* حين تتوفر صورة حقيقية: نضعها داخل نفس إطار الجهاز */
  function withImage(p, title) {
    var img = '<img src="' + esc(p.image) + '" alt="' + esc(title) + '" loading="lazy" decoding="async">';
    if (p.device === 'none') {
      return img.replace('<img', '<img class="dev-bare"');
    }
    if (p.device === 'phone') {
      return '<div class="dev dev-phone"><div class="dev-phone-screen">' + img + '</div></div>';
    }
    return '<div class="dev dev-browser"><div class="dev-bar"><i></i><i></i><i></i><b></b></div><div class="dev-screen">' + img + '</div></div>';
  }

  window.renderMockup = function (p, title) {
    if (p.image) return withImage(p, title);
    var fn = T[p.mockup] || T.website;
    return fn();
  };
})();
