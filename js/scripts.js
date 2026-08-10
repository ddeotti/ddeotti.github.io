/* =========================================================
   Portal Prof. Diego Deotti - JavaScript
   ========================================================= */

(function () {
  'use strict';

  /* ----- Menu Mobile ----- */
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const icon = toggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isOpen ? 'close' : 'menu';
    });

    // Fecha menu ao clicar em um link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const icon = toggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  /* ----- Marcar link ativo na navegação ----- */
  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

 /* ----- Formulário de contato ----- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const assunto = form.elements['subject'].value.trim();
    const mensagem = form.elements['message'].value.trim();

    if (!nome || !email || !assunto || !mensagem) {
      showStatus(
        status,
        'Por favor, preencha todos os campos.',
        'error'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showStatus(
        status,
        'Por favor, informe um e-mail válido.',
        'error'
      );
      return;
    }

    try {
      button.disabled = true;

      showStatus(
        status,
        'Enviando mensagem...',
        'info'
      );

      const formData = new FormData(form);

      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      if (result.success) {
        showStatus(
          status,
          'Mensagem enviada com sucesso! Retornarei o contato em breve.',
          'success'
        );

        form.reset();
      } else {
        console.error('Erro Web3Forms:', result);

        showStatus(
          status,
          'Não foi possível enviar a mensagem. Tente novamente.',
          'error'
        );
      }

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      showStatus(
        status,
        'Erro de conexão. Tente novamente.',
        'error'
      );

    } finally {
      button.disabled = false;
    }
  });
}

  function showStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = 'form-status ' + type;
    setTimeout(function () {
      el.className = 'form-status';
      el.textContent = '';
    }, 6000);
  }

  /* ----- Filtro de Publicações ----- */
  function initPublicationFilters() {
    const yearFilter = document.querySelectorAll('.filter-list li');
    const typeFilter = document.querySelectorAll('.filter-checkbox input');
    const yearGroups = document.querySelectorAll('.year-group');
    const publications = document.querySelectorAll('.publication');

    if (!yearGroups.length) return;

    // Filtro por ano
    yearFilter.forEach(function (item) {
      item.addEventListener('click', function () {
        yearFilter.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const selectedYear = item.dataset.year;
        yearGroups.forEach(function (group) {
          if (selectedYear === 'all' || group.dataset.year === selectedYear) {
            group.style.display = '';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });

    // Filtro por tipo
    typeFilter.forEach(function (cb) {
      cb.addEventListener('change', function () {
        const checkedTypes = Array.from(typeFilter)
          .filter(c => c.checked)
          .map(c => c.dataset.type);

        publications.forEach(function (pub) {
          const pubType = pub.dataset.type;
          if (checkedTypes.length === 0 || checkedTypes.includes(pubType)) {
            pub.style.display = '';
          } else {
            pub.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----- Login Orientandos (mock) ----- */
  function initRestrictedLogin() {
    const btn = document.querySelector('#restricted-access-btn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Área restrita: efetue login com suas credenciais institucionais.\n\n(Funcionalidade de autenticação a ser integrada com o sistema da universidade.)');
    });
  }

  /* ----- Init ----- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    setActiveNav();
    initContactForm();
    initPublicationFilters();
    initRestrictedLogin();
  });
})();
