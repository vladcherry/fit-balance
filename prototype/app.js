/* FitBalance — clickable prototype.
   Everything runs in the browser; nothing is sent anywhere. */

(function () {
  'use strict';

  var KCAL_PER_KG = 7700;
  var STORAGE_KEY = 'fitbalance.prototype.v1';

  /* ---------------- copy ---------------- */

  var COPY = {
    ru: {
      'nav.today': 'Сегодня', 'nav.history': 'История', 'nav.stats': 'Статистика', 'nav.profile': 'Профиль',
      'unit.kcal': 'ккал', 'unit.g': 'г', 'unit.kg': 'кг', 'unit.min': 'мин',
      'a11y.back': 'Назад', 'a11y.less': 'Меньше', 'a11y.more': 'Больше',

      'home.leftToBurn': 'Осталось сжечь', 'home.targetMet': 'Цель дня выполнена',
      'home.eaten': 'Съедено', 'home.burned': 'Сожжено', 'home.maintenance': 'Норма',
      'home.deficitNow': 'Дефицит сейчас', 'home.surplusNow': 'Профицит сейчас',
      'home.days7': '7 дней', 'home.days30': '30 дней',
      'home.feed': 'ЛЕНТА ДНЯ', 'home.all': 'Всё', 'home.snapFood': 'Снять еду',
      'home.targetNote': 'чтобы выйти на дневной дефицит {target} ккал',
      'home.targetDone': 'сверх цели ещё {extra} ккал',
      'home.empty': 'Сегодня пока ничего не записано',

      'photo.eyebrow': 'Распознавание на устройстве', 'photo.cancel': 'Отмена',
      'photo.newMeal': 'НОВЫЙ ПРИЁМ ПИЩИ', 'photo.headlineTotal': '≈ {kcal} ККАЛ',
      'photo.tapToShoot': 'Нажмите, чтобы снять фото',
      'photo.retake': 'Переснять', 'photo.fromGallery': 'Из галереи',
      'photo.analysing': 'Разбираю на устройстве…',
      'photo.loadingModel': 'Загружаю модель… {percent}%',
      'photo.recognised': 'Узнал: {name} · уверенность ≈ {percent}%. Проверьте вес и калории.',
      'photo.unsure': 'Уверенности мало. Выберите вариант ниже или впишите вручную.',
      'photo.noFood': 'Еду на снимке узнать не удалось. Впишите продукт вручную.',
      'photo.modelFailed': 'Модель не загрузилась. Нужен интернет на первый раз — потом работает без сети.',
      'photo.maybe': 'Может быть',
      'photo.scope': 'Модель знает около 40 категорий: фастфуд, выпечку, фрукты и овощи. Остальное — вручную.',
      'photo.privacy': 'Снимок разбирается прямо на телефоне и никуда не отправляется.',
      'photo.mealType': 'Приём пищи', 'photo.items': 'Состав · можно поправить',
      'photo.emptyItems': 'Снимите фото или добавьте продукт вручную.',
      'photo.total': 'Итого', 'photo.totalWeight': '{g} г всего',
      'photo.addProduct': 'Добавить продукт', 'photo.save': 'Записать в дневник',
      'photo.saved': 'Записано: +{kcal} ккал',

      'editor.name': 'Название', 'editor.grams': 'Вес, г', 'editor.kcal': 'Ккал',
      'editor.delete': 'Удалить', 'editor.done': 'Готово', 'editor.newItem': 'Новый продукт',
      'editor.hint': 'Меняете вес — калории пересчитываются. Впишите ккал, чтобы задать точно.',
      // Kept so a meal saved by the demo-recognition build still reads correctly.
      'food.chicken': 'Курица гриль', 'food.rice': 'Рис отварной', 'food.veg': 'Овощи на пару',

      'act.eyebrow': 'Активность вручную', 'act.title': 'Активность', 'act.headline': 'ЧТО И СКОЛЬКО?',
      'act.type': 'Вид активности', 'act.duration': 'Длительность', 'act.intensity': 'Интенсивность',
      'act.willCount': 'Будет засчитано', 'act.knowBetter': 'Знаете точнее — впишите сами',
      'act.add': 'Добавить в день', 'act.metNote': 'Оценка по MET — это ориентир, а не измерение',
      'act.basis': 'расчёт по весу {weight} кг', 'act.saved': 'Активность записана: −{kcal} ккал',
      'act.walking': 'Ходьба', 'act.running': 'Бег', 'act.gym': 'Зал',
      'act.cycling': 'Велосипед', 'act.swimming': 'Плавание', 'act.chores': 'Дом. дела',
      'act.light': 'Лёгкая', 'act.moderate': 'Средняя', 'act.high': 'Высокая',

      'meal.breakfast': 'Завтрак', 'meal.lunch': 'Обед', 'meal.dinner': 'Ужин', 'meal.snack': 'Перекус',

      'stats.eyebrow': 'FitBalance · 30 дней', 'stats.accumulated': 'накопленный дефицит в жировом эквиваленте',
      'stats.perDay': 'Дефицит по дням · цель 700', 'stats.toNextKg': 'До эквивалента −2,5 кг',
      'stats.remaining': 'ещё {kcal} ккал', 'stats.last30': 'Последние 30 дней',
      'stats.surplus': 'профицит', 'stats.deficit': 'дефицит',
      'stats.week': 'Неделя', 'stats.month': 'Месяц', 'stats.year': 'Год',

      'prof.title': 'ВАШИ НАСТРОЙКИ', 'prof.body': 'Данные тела', 'prof.sex': 'Пол', 'prof.male': 'Мужской',
      'prof.age': 'Возраст', 'prof.ageValue': '34 года', 'prof.height': 'Рост, см', 'prof.weight': 'Вес, кг',
      'prof.goalNorm': 'Цель и норма', 'prof.lose': 'Похудение', 'prof.change': 'Изменить',
      'prof.deficitPerDay': 'Дефицит в день', 'prof.calculated': 'рассчитано',
      'prof.perDayGrams': '≈ {g} г в день',
      'prof.activitySource': 'Откуда берётся активность', 'prof.manual': 'Ввод вручную',
      'prof.manualHint': 'Вид, время, интенсивность — и приложение считает ккал',
      'prof.healthConnect': 'Health Connect', 'prof.healthHint': 'Android, в следующей версии', 'prof.later': 'Позже',
      'prof.language': 'Язык',
      'prof.disclaimer': 'Фото разбираются на устройстве и никуда не уходят. Жировой эквивалент (7 700 ккал = 1 кг) — условный ориентир, а не измерение состава тела.',
      'prof.reset': 'Сбросить день до демо-данных', 'prof.resetDone': 'День сброшен',

      'install.title': 'Установить FitBalance',
      'install.sub': 'Откроется с домашнего экрана, как обычное приложение',
      'install.action': 'Установить', 'install.dismiss': 'Скрыть',
      'install.iosTitle': 'Установка на iPhone',
      'install.ios1': 'Нажмите «Поделиться» в нижней панели Safari',
      'install.ios2': 'Пролистайте список и выберите «На экран „Домой“»',
      'install.ios3': 'Нажмите «Добавить» в правом верхнем углу',
      'install.iosNote': 'Работает только в Safari. В Chrome на iPhone этого пункта нет.',
      'install.gotIt': 'Понятно', 'install.done': 'Приложение установлено',

      'prof.app': 'Приложение', 'prof.version': 'Версия', 'prof.update': 'Обновить',
      'prof.checking': 'Проверяю…', 'prof.upToDate': 'У вас последняя версия',
      'prof.updating': 'Есть новая версия — обновляю…', 'prof.dev': 'локальная сборка',

      'weekdays': ['чт', 'пт', 'сб', 'вс', 'пн', 'вт', 'ср'],
      'dateLine': 'СР 17.09'
    },
    en: {
      'nav.today': 'Today', 'nav.history': 'History', 'nav.stats': 'Stats', 'nav.profile': 'Profile',
      'unit.kcal': 'kcal', 'unit.g': 'g', 'unit.kg': 'kg', 'unit.min': 'min',
      'a11y.back': 'Back', 'a11y.less': 'Less', 'a11y.more': 'More',

      'home.leftToBurn': 'Left to burn', 'home.targetMet': "Today's target is met",
      'home.eaten': 'Eaten', 'home.burned': 'Burned', 'home.maintenance': 'Maintenance',
      'home.deficitNow': 'Deficit now', 'home.surplusNow': 'Surplus now',
      'home.days7': '7 days', 'home.days30': '30 days',
      'home.feed': 'TODAY’S FEED', 'home.all': 'All', 'home.snapFood': 'Snap a meal',
      'home.targetNote': 'to reach the {target} kcal daily deficit',
      'home.targetDone': '{extra} kcal past the target',
      'home.empty': 'Nothing logged yet today',

      'photo.eyebrow': 'On-device recognition', 'photo.cancel': 'Cancel',
      'photo.newMeal': 'NEW MEAL', 'photo.headlineTotal': '≈ {kcal} KCAL',
      'photo.tapToShoot': 'Tap to take a photo',
      'photo.retake': 'Retake', 'photo.fromGallery': 'From gallery',
      'photo.analysing': 'Analysing on the device…',
      'photo.loadingModel': 'Loading the model… {percent}%',
      'photo.recognised': 'Recognised: {name} · confidence ≈ {percent}%. Check the weight and calories.',
      'photo.unsure': 'Not confident enough. Pick one below, or type it in by hand.',
      'photo.noFood': 'No food could be recognised in the picture. Add the item by hand.',
      'photo.modelFailed': 'The model failed to load. It needs the network once — after that it works offline.',
      'photo.maybe': 'Maybe',
      'photo.scope': 'The model knows about forty categories: fast food, baked goods, fruit and vegetables. Anything else goes in by hand.',
      'photo.privacy': 'The picture is analysed on the phone and never leaves it.',
      'photo.mealType': 'Meal', 'photo.items': 'Contents · editable',
      'photo.emptyItems': 'Take a photo, or add an item by hand.',
      'photo.total': 'Total', 'photo.totalWeight': '{g} g in total',
      'photo.addProduct': 'Add an item', 'photo.save': 'Save to diary',
      'photo.saved': 'Saved: +{kcal} kcal',

      'editor.name': 'Name', 'editor.grams': 'Weight, g', 'editor.kcal': 'Kcal',
      'editor.delete': 'Delete', 'editor.done': 'Done', 'editor.newItem': 'New item',
      'editor.hint': 'Change the weight and the calories follow. Type the calories to set them exactly.',
      'food.chicken': 'Grilled chicken', 'food.rice': 'Boiled rice', 'food.veg': 'Steamed vegetables',

      'act.eyebrow': 'Manual activity', 'act.title': 'Activity', 'act.headline': 'WHAT AND HOW LONG?',
      'act.type': 'Activity type', 'act.duration': 'Duration', 'act.intensity': 'Intensity',
      'act.willCount': 'Will be counted', 'act.knowBetter': 'Know it better — type it in',
      'act.add': 'Add to the day', 'act.metNote': 'A MET estimate is a guide, not a measurement',
      'act.basis': 'based on {weight} kg body weight', 'act.saved': 'Activity saved: −{kcal} kcal',
      'act.walking': 'Walking', 'act.running': 'Running', 'act.gym': 'Gym',
      'act.cycling': 'Cycling', 'act.swimming': 'Swimming', 'act.chores': 'Housework',
      'act.light': 'Light', 'act.moderate': 'Moderate', 'act.high': 'High',

      'meal.breakfast': 'Breakfast', 'meal.lunch': 'Lunch', 'meal.dinner': 'Dinner', 'meal.snack': 'Snack',

      'stats.eyebrow': 'FitBalance · 30 days', 'stats.accumulated': 'accumulated deficit as fat equivalent',
      'stats.perDay': 'Deficit per day · target 700', 'stats.toNextKg': 'To −2.5 kg equivalent',
      'stats.remaining': '{kcal} kcal to go', 'stats.last30': 'Last 30 days',
      'stats.surplus': 'surplus', 'stats.deficit': 'deficit',
      'stats.week': 'Week', 'stats.month': 'Month', 'stats.year': 'Year',

      'prof.title': 'YOUR SETTINGS', 'prof.body': 'Body data', 'prof.sex': 'Sex', 'prof.male': 'Male',
      'prof.age': 'Age', 'prof.ageValue': '34 years', 'prof.height': 'Height, cm', 'prof.weight': 'Weight, kg',
      'prof.goalNorm': 'Goal and requirement', 'prof.lose': 'Lose weight', 'prof.change': 'Change',
      'prof.deficitPerDay': 'Daily deficit', 'prof.calculated': 'calculated',
      'prof.perDayGrams': '≈ {g} g per day',
      'prof.activitySource': 'Where activity comes from', 'prof.manual': 'Manual entry',
      'prof.manualHint': 'Type, duration, intensity — the app does the calories',
      'prof.healthConnect': 'Health Connect', 'prof.healthHint': 'Android, next release', 'prof.later': 'Later',
      'prof.language': 'Language',
      'prof.disclaimer': 'Photos are analysed on the device and never leave it. The fat equivalent (7,700 kcal = 1 kg) is a conventional figure, not a body-composition measurement.',
      'prof.reset': 'Reset the day to demo data', 'prof.resetDone': 'Day reset',

      'install.title': 'Install FitBalance',
      'install.sub': 'Opens from the home screen like any other app',
      'install.action': 'Install', 'install.dismiss': 'Dismiss',
      'install.iosTitle': 'Installing on iPhone',
      'install.ios1': 'Tap Share in the Safari toolbar',
      'install.ios2': 'Scroll the list and choose “Add to Home Screen”',
      'install.ios3': 'Tap “Add” in the top right corner',
      'install.iosNote': 'Safari only — Chrome on iPhone does not offer this.',
      'install.gotIt': 'Got it', 'install.done': 'App installed',

      'prof.app': 'App', 'prof.version': 'Version', 'prof.update': 'Update',
      'prof.checking': 'Checking…', 'prof.upToDate': 'You are on the latest version',
      'prof.updating': 'A new version is available — updating…', 'prof.dev': 'local build',

      'weekdays': ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      'dateLine': 'WED 17.09'
    }
  };

  /* ---------------- domain ---------------- */

  var MET = { walking: 3.8, running: 9.8, gym: 5.0, cycling: 7.5, swimming: 7.0, chores: 3.3 };
  var INTENSITY = { light: 0.8, moderate: 1.0, high: 1.3 };
  var ACTIVITY_TYPES = ['walking', 'running', 'gym', 'cycling', 'swimming', 'chores'];
  var DURATION_PRESETS = [15, 30, 45, 60, 90];
  var WEEK = [-950, -720, 260, -640, -1100, -1120, -970];

  function seedEntries() {
    return [
      { time: '08:30', kind: 'food', key: 'meal.breakfast', kcal: 450 },
      { time: '11:40', kind: 'activity', key: 'act.walking', kcal: 310 },
      { time: '13:10', kind: 'food', key: 'meal.lunch', kcal: 720 },
      { time: '16:20', kind: 'food', key: 'meal.snack', kcal: 280 },
      { time: '19:30', kind: 'activity', key: 'act.chores', kcal: 140 },
      { time: '20:40', kind: 'food', key: 'meal.dinner', kcal: 900 }
    ];
  }

  /* A recognised food becomes a draft item: the model names it and supplies a
     typical serving, and every number stays editable. */
  function itemFromFood(food) {
    return {
      food: food.id,
      grams: food.portion,
      kcal: Math.round(food.kcal * food.portion / 100),
      per100: food.kcal
    };
  }

  var MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner'];

  var state = {
    lang: 'ru',
    weight: 84.5,
    maintenance: 2200,
    target: 700,
    entries: seedEntries(),
    draft: { type: 'walking', minutes: 45, intensity: 'moderate', manual: '' },
    meal: { type: 'lunch', items: [], editing: -1 }
  };

  function mealTotals() {
    var kcal = 0, grams = 0;
    state.meal.items.forEach(function (it) {
      kcal += Number(it.kcal) || 0;
      grams += Number(it.grams) || 0;
    });
    return { kcal: Math.round(kcal), grams: Math.round(grams) };
  }

  function totals() {
    var eaten = 0, burned = 0;
    state.entries.forEach(function (e) {
      if (e.kind === 'food') { eaten += e.kcal; } else { burned += e.kcal; }
    });
    var deficit = state.maintenance + burned - eaten;
    return {
      eaten: eaten,
      burned: burned,
      deficit: deficit,
      leftToBurn: Math.max(0, state.target - deficit),
      grams: Math.round(Math.abs(deficit) / KCAL_PER_KG * 1000)
    };
  }

  function estimateKcal() {
    var manual = parseInt(state.draft.manual, 10);
    if (!isNaN(manual) && manual > 0) { return manual; }
    var met = MET[state.draft.type] * INTENSITY[state.draft.intensity];
    return Math.round(met * state.weight * (state.draft.minutes / 60));
  }

  /* ---------------- storage ---------------- */

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { return; }
      var saved = JSON.parse(raw);
      if (saved && Array.isArray(saved.entries)) {
        Object.keys(state).forEach(function (k) {
          if (saved[k] !== undefined) { state[k] = saved[k]; }
        });
      }
    } catch (err) { /* corrupt or blocked — keep defaults */ }
  }

  /* ---------------- helpers ---------------- */

  function t(key, vars) {
    var s = COPY[state.lang][key];
    if (s === undefined) { return key; }
    if (vars) {
      Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    }
    return s;
  }

  function num(n) {
    return new Intl.NumberFormat(state.lang === 'ru' ? 'ru-RU' : 'en-US').format(n);
  }

  function el(id) { return document.getElementById(id); }

  function button(label, pressed, onClick, className) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = className || '';
    b.textContent = label;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }

  var toastTimer = null;
  function toast(message) {
    var node = el('toast');
    node.textContent = message;
    node.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove('is-on'); }, 2400);
  }

  /* ---------------- rendering ---------------- */

  function renderStaticCopy() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
      node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
    });
    el('today-date').textContent = t('dateLine');
    el('p-age').textContent = t('prof.ageValue');
  }

  function renderHome() {
    var s = totals();
    var met = s.deficit >= state.target;

    el('left-to-burn').textContent = met ? num(s.deficit) : num(s.leftToBurn);
    el('home-metric').textContent = met ? t('home.targetMet') : t('home.leftToBurn');
    el('target-note').textContent = met
      ? t('home.targetDone', { extra: num(s.deficit - state.target) })
      : t('home.targetNote', { target: num(state.target) });

    var pct = Math.max(0, Math.min(100, Math.round(s.deficit / state.target * 100)));
    el('target-bar').style.width = pct + '%';

    el('m-eaten').textContent = num(s.eaten);
    el('m-burned').textContent = num(s.burned);
    el('m-norm').textContent = num(state.maintenance);

    document.querySelector('[data-i18n="home.deficitNow"]').textContent =
      s.deficit >= 0 ? t('home.deficitNow') : t('home.surplusNow');
    el('deficit-kcal').textContent = num(Math.abs(s.deficit));
    el('deficit-grams').textContent = t('unit.kcal') + ' · ≈ ' + num(s.grams) + ' ' + t('unit.g');

    var feed = el('feed');
    feed.innerHTML = '';
    if (!state.entries.length) {
      feed.innerHTML = '<div class="feed__empty">' + t('home.empty') + '</div>';
      return;
    }
    state.entries.slice().reverse().forEach(function (e) {
      var row = document.createElement('div');
      row.className = 'feed__row';
      var burn = e.kind === 'activity';
      row.innerHTML =
        '<div class="feed__time"></div>' +
        '<div class="feed__name"></div>' +
        '<div class="feed__kcal' + (burn ? ' is-burn' : '') + '"></div>';
      row.children[0].textContent = e.time;
      row.children[1].textContent = t(e.key);
      row.children[2].textContent = (burn ? '−' : '+') + num(e.kcal);
      feed.appendChild(row);
    });
  }

  function itemLabel(it) {
    if (it.food) {
      var food = window.FoodRecognition && window.FoodRecognition.byId(it.food);
      if (food) { return food[state.lang] || food.en; }
    }
    if (it.key) { return t(it.key); }
    return it.name && it.name.trim() ? it.name : t('editor.newItem');
  }

  function fillRow(row, it) {
    row.querySelector('.item__name').textContent = itemLabel(it);
    row.querySelector('.item__sub').textContent =
      it.grams ? '≈ ' + num(it.grams) + ' ' + t('unit.g') : '—';
    row.querySelector('.item__kcal').textContent = num(Number(it.kcal) || 0);
  }

  function updateMealSummary() {
    var m = mealTotals();
    el('meal-total').textContent = num(m.kcal);
    el('meal-weight').textContent = m.grams ? t('photo.totalWeight', { g: num(m.grams) }) : '';
    el('photo-headline').textContent = m.kcal
      ? t('photo.headlineTotal', { kcal: num(m.kcal) })
      : t('photo.newMeal');
    el('save-meal').disabled = m.kcal === 0;
    el('save-meal').style.opacity = m.kcal === 0 ? '0.45' : '1';
  }

  function numberField(labelText, value) {
    var label = document.createElement('label');
    var caption = document.createElement('span');
    caption.className = 'editor__k';
    caption.textContent = labelText;
    var input = document.createElement('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.min = '0';
    input.value = value === '' || value === undefined ? '' : value;
    label.appendChild(caption);
    label.appendChild(input);
    label.__input = input;
    return label;
  }

  function buildEditor(it, index, row) {
    var box = document.createElement('div');
    box.className = 'editor';

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = it.food || it.key ? itemLabel(it) : (it.name || '');
    nameInput.placeholder = t('editor.name');
    nameInput.setAttribute('aria-label', t('editor.name'));
    box.appendChild(nameInput);

    var pair = document.createElement('div');
    pair.className = 'editor__pair';
    var gramsField = numberField(t('editor.grams'), it.grams);
    var kcalField = numberField(t('editor.kcal'), it.kcal);
    pair.appendChild(gramsField);
    pair.appendChild(kcalField);
    box.appendChild(pair);

    var hint = document.createElement('div');
    hint.className = 'editor__hint';
    hint.textContent = t('editor.hint');
    box.appendChild(hint);

    var row2 = document.createElement('div');
    row2.className = 'editor__row';
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'editor__del';
    del.textContent = t('editor.delete');
    var done = document.createElement('button');
    done.type = 'button';
    done.className = 'editor__done';
    done.textContent = t('editor.done');
    row2.appendChild(del);
    row2.appendChild(done);
    box.appendChild(row2);

    nameInput.addEventListener('input', function () {
      it.key = null;               // a typed name replaces the recognised label
      it.food = null;
      it.name = this.value;
      fillRow(row, it);
      save();
    });

    gramsField.__input.addEventListener('input', function () {
      var g = parseFloat(String(this.value).replace(',', '.'));
      it.grams = isNaN(g) || g < 0 ? '' : g;
      if (it.per100 && it.grams !== '') {
        it.kcal = Math.round(it.grams * it.per100 / 100);
        kcalField.__input.value = it.kcal;
      }
      fillRow(row, it);
      updateMealSummary();
      save();
    });

    kcalField.__input.addEventListener('input', function () {
      var k = parseFloat(String(this.value).replace(',', '.'));
      it.kcal = isNaN(k) || k < 0 ? '' : Math.round(k);
      if (it.grams > 0 && it.kcal !== '') { it.per100 = it.kcal / it.grams * 100; }
      fillRow(row, it);
      updateMealSummary();
      save();
    });

    del.addEventListener('click', function () {
      state.meal.items.splice(index, 1);
      state.meal.editing = -1;
      renderMeal();
      save();
    });

    done.addEventListener('click', function () {
      state.meal.editing = -1;
      renderMeal();
      save();
    });

    return box;
  }

  function renderMeal() {
    var types = el('meal-types');
    types.innerHTML = '';
    MEAL_TYPES.forEach(function (key) {
      types.appendChild(button(t('meal.' + key), state.meal.type === key, function () {
        state.meal.type = key;
        renderMeal();
        save();
      }, 'chip'));
    });

    var list = el('meal-items');
    list.innerHTML = '';

    if (!state.meal.items.length) {
      var empty = document.createElement('div');
      empty.className = 'items__empty';
      empty.textContent = t('photo.emptyItems');
      list.appendChild(empty);
    }

    state.meal.items.forEach(function (it, i) {
      var wrap = document.createElement('div');
      wrap.className = 'item-wrap' + (state.meal.editing === i ? ' is-editing' : '');

      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'item';
      row.innerHTML =
        '<span style="flex-grow:1;min-width:0">' +
          '<span class="item__name"></span>' +
          '<span class="item__sub"></span>' +
        '</span>' +
        '<span class="item__kcal"></span>' +
        '<svg class="item__chevron" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9.5 5 16 12l-6.5 7"/></svg>';
      fillRow(row, it);
      row.addEventListener('click', function () {
        state.meal.editing = state.meal.editing === i ? -1 : i;
        renderMeal();
      });
      wrap.appendChild(row);

      if (state.meal.editing === i) { wrap.appendChild(buildEditor(it, i, row)); }
      list.appendChild(wrap);
    });

    updateMealSummary();
  }

  function renderActivity() {
    var types = el('act-types');
    types.innerHTML = '';
    ACTIVITY_TYPES.forEach(function (key) {
      types.appendChild(button(t('act.' + key), state.draft.type === key, function () {
        state.draft.type = key;
        state.draft.manual = '';
        el('act-manual').value = '';
        renderActivity();
        save();
      }, 'chip'));
    });

    var presets = el('dur-presets');
    presets.innerHTML = '';
    DURATION_PRESETS.forEach(function (m) {
      presets.appendChild(button(String(m), state.draft.minutes === m, function () {
        state.draft.minutes = m;
        renderActivity();
        save();
      }));
    });

    var seg = el('act-intensity');
    seg.innerHTML = '';
    ['light', 'moderate', 'high'].forEach(function (key) {
      seg.appendChild(button(t('act.' + key), state.draft.intensity === key, function () {
        state.draft.intensity = key;
        renderActivity();
        save();
      }));
    });

    el('dur-value').textContent = state.draft.minutes;
    el('act-kcal').textContent = num(estimateKcal());
    el('act-basis').textContent = t('act.basis', { weight: num(state.weight) });
  }

  function renderStats() {
    var seg = el('stats-period');
    if (!seg.children.length) {
      ['week', 'month', 'year'].forEach(function (key, i) {
        seg.appendChild(button(t('stats.' + key), i === 0, function () {
          Array.prototype.forEach.call(seg.children, function (b, j) {
            b.setAttribute('aria-pressed', i === j ? 'true' : 'false');
          });
        }));
      });
    } else {
      ['week', 'month', 'year'].forEach(function (key, i) {
        seg.children[i].textContent = t('stats.' + key);
      });
    }

    var peak = 1200;
    var pos = el('chart-pos'), neg = el('chart-neg'), days = el('chart-days');
    pos.innerHTML = ''; neg.innerHTML = ''; days.innerHTML = '';
    WEEK.forEach(function (value, i) {
      var isToday = i === WEEK.length - 1;
      var up = document.createElement('div');
      up.className = 'chart__col';
      var down = document.createElement('div');
      down.className = 'chart__col';
      var bar = document.createElement('div');
      bar.className = 'chart__bar';
      if (value > 0) {
        bar.classList.add('is-surplus');
        bar.style.height = Math.min(26, Math.round(value / peak * 86)) + 'px';
        bar.style.borderRadius = '4px 4px 0 0';
        up.appendChild(bar);
      } else {
        if (isToday) { bar.classList.add('is-today'); }
        bar.style.height = Math.round(-value / peak * 86) + 'px';
        bar.style.borderRadius = '0 0 4px 4px';
        down.appendChild(bar);
      }
      pos.appendChild(up);
      neg.appendChild(down);

      var day = document.createElement('div');
      day.className = 'chart__day' + (isToday ? ' is-today' : '');
      day.textContent = COPY[state.lang].weekdays[i];
      days.appendChild(day);
    });

    el('stats-remaining').textContent = t('stats.remaining', { kcal: num(770) });

    var strip = el('strip');
    if (!strip.children.length) {
      var levels = [3, 2, 1, 3, 0, 2, 3, 3, 1, 2, 3, 0, 2, 3, 3, 2, 1, 3, 2, 3, 0, 2, 3, 1, 3, 3, 2, 3, 3, 3];
      var fills = ['#17120f', '#f6d9d8', '#e8807f', '#d8161d'];
      levels.forEach(function (lv) {
        var cell = document.createElement('div');
        cell.style.background = fills[lv];
        strip.appendChild(cell);
      });
    }
  }

  function renderProfile() {
    el('p-target').textContent = num(state.target);
    el('p-norm').textContent = num(state.maintenance);
    el('p-target-g').textContent = t('prof.perDayGrams', {
      g: num(Math.round(state.target / KCAL_PER_KG * 1000))
    });
    el('p-weight').value = state.weight;
    Array.prototype.forEach.call(el('lang-switch').children, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === state.lang ? 'true' : 'false');
    });
  }

  function renderAll() {
    renderStaticCopy();
    renderHome();
    renderMeal();
    renderActivity();
    renderStats();
    renderProfile();
  }

  /* ---------------- navigation ---------------- */

  var MODALS = { photo: true, activity: true };

  /* Every forward move pushes a history entry, so the phone's own back gesture
     walks back through the app instead of leaving it. */
  var navDepth = 0;

  function show(name) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.toggle('is-active', s.id === 'screen-' + name);
    });
    el('tabbar').classList.toggle('is-hidden', !!MODALS[name]);
    Array.prototype.forEach.call(el('tabbar').children, function (b) {
      if (b.getAttribute('data-go') === name) {
        b.setAttribute('aria-current', 'page');
      } else {
        b.removeAttribute('aria-current');
      }
    });
    var screen = el('screen-' + name);
    if (screen) { screen.scrollTop = 0; }
    releaseModelSoon(name !== 'photo');
  }

  /* Phones, iOS Safari above all, hold a tight per-tab memory budget, so the
     model does not stay resident after the photo screen is left. The delay
     keeps it around while the user steps out and comes straight back. */
  var modelUnloadTimer = null;
  function releaseModelSoon(release) {
    clearTimeout(modelUnloadTimer);
    if (!release || !window.FoodRecognition) { return; }
    modelUnloadTimer = setTimeout(function () { window.FoodRecognition.unload(); }, 30000);
  }

  function go(name, replace) {
    var current = history.state && history.state.screen;
    show(name);
    if (replace || current === name) {
      history.replaceState({ screen: name }, '', '#' + name);
      return;
    }
    history.pushState({ screen: name }, '', '#' + name);
    navDepth += 1;
  }

  function goBack() {
    if (navDepth > 0) {
      history.back();
      return;
    }
    go('home', true);           // deep link straight into a screen: nowhere to go back to
  }

  window.addEventListener('popstate', function (e) {
    var name = (e.state && e.state.screen) || (location.hash || '#home').slice(1);
    if (!document.getElementById('screen-' + name)) { name = 'home'; }
    navDepth = Math.max(0, navDepth - 1);
    show(name);

    var sheet = el('ios-sheet');
    if (sheet && !sheet.hidden) { sheet.hidden = true; }
  });

  function nowLabel() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  /* ---------------- wiring ---------------- */

  function wire() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-back]')) { goBack(); return; }
      var target = e.target.closest('[data-go]');
      if (target) { go(target.getAttribute('data-go')); }
    });

    el('dur-minus').addEventListener('click', function () {
      state.draft.minutes = Math.max(5, state.draft.minutes - 5);
      renderActivity();
      save();
    });
    el('dur-plus').addEventListener('click', function () {
      state.draft.minutes = Math.min(300, state.draft.minutes + 5);
      renderActivity();
      save();
    });
    el('act-manual').addEventListener('input', function () {
      state.draft.manual = this.value;
      el('act-kcal').textContent = num(estimateKcal());
    });

    el('save-activity').addEventListener('click', function () {
      var kcal = estimateKcal();
      state.entries.push({
        time: nowLabel(), kind: 'activity', key: 'act.' + state.draft.type, kcal: kcal
      });
      state.draft.manual = '';
      el('act-manual').value = '';
      save();
      renderHome();
      goBack();
      toast(t('act.saved', { kcal: num(kcal) }));
    });

    // The picture is held as an object URL inside the page. Nothing is uploaded:
    // the model runs against this very <img>, on this device.
    var photoUrl = null;
    var analysisId = 0;                       // a newer picture invalidates an older pass

    function photoStatus(text) { el('photo-status').textContent = text; }

    function photoNote(text, warn) {
      el('photo-note-text').textContent = text || '';
      el('photo-note').hidden = !text;
      el('photo-note').classList.toggle('notice--warn', !!warn);
      el('photo-note').classList.toggle('notice--ok', !warn);
    }

    function foodName(food) { return food[state.lang] || food.en; }

    function renderGuesses(list) {
      var chips = el('photo-guess-chips');
      chips.innerHTML = '';
      el('photo-guesses').hidden = !list || !list.length;
      (list || []).forEach(function (food) {
        chips.appendChild(button(foodName(food), false, function () {
          applyFood(food);
          photoNote(t('photo.recognised', {
            name: foodName(food), percent: Math.round(food.probability * 100)
          }), false);
          renderGuesses(list.filter(function (other) { return other.id !== food.id; }));
        }, 'chip'));
      });
    }

    function dropRecognisedItems() {
      state.meal.items = state.meal.items.filter(function (it) { return !it.food; });
      state.meal.editing = -1;
      renderMeal();
      save();
    }

    // A recognition pass replaces earlier recognised items and leaves hand-typed ones alone.
    function applyFood(food) {
      var manual = state.meal.items.filter(function (it) { return !it.food; });
      state.meal.items = [itemFromFood(food)].concat(manual);
      state.meal.editing = -1;
      renderMeal();
      save();
    }

    function analyse(file) {
      var run = ++analysisId;
      var frame = el('photo-frame');
      var preview = el('photo-preview');

      if (photoUrl) { URL.revokeObjectURL(photoUrl); }
      photoUrl = URL.createObjectURL(file);
      preview.src = photoUrl;

      // The previous picture's result must not survive into this one: what the
      // model found last time is not in the frame any more. Hand-typed items are.
      dropRecognisedItems();
      frame.classList.add('has-photo', 'is-busy');
      photoNote('');
      renderGuesses([]);
      photoStatus(t('photo.analysing'));

      var decoded = preview.decode ? preview.decode() : Promise.resolve();
      decoded.then(function () {
        if (run !== analysisId) { return null; }
        if (FoodRecognition.isLoaded()) { return null; }
        // First run only: ~15 MB of runtime and weights. Never silent.
        photoStatus(t('photo.loadingModel', { percent: 0 }));
        return FoodRecognition.load(function (fraction) {
          if (run !== analysisId) { return; }
          photoStatus(t('photo.loadingModel', { percent: Math.round(fraction * 100) }));
        });
      }).then(function () {
        if (run !== analysisId) { return null; }
        photoStatus(t('photo.analysing'));
        return FoodRecognition.classify(preview);
      }).then(function (result) {
        if (run !== analysisId || !result) { return; }
        frame.classList.remove('is-busy');
        if (result.food) {
          applyFood(result.food);
          photoNote(t('photo.recognised', {
            name: foodName(result.food),
            percent: Math.round(result.food.probability * 100)
          }), false);
        } else {
          photoNote(t(result.guesses.length ? 'photo.unsure' : 'photo.noFood'), true);
        }
        renderGuesses(result.guesses);
      })['catch'](function (err) {
        if (run !== analysisId) { return; }
        frame.classList.remove('is-busy');
        photoNote(t('photo.modelFailed'), true);
        if (window.console) { console.error(err); }
      });
    }

    // Two inputs, because one cannot be both: `capture` goes straight to the
    // camera, the plain one opens the gallery.
    ['photo-camera', 'photo-gallery'].forEach(function (id) {
      el(id).addEventListener('change', function () {
        var file = this.files && this.files[0];
        this.value = '';                      // picking the same file again still fires
        if (file) { analyse(file); }
      });
    });

    function resetMeal() {
      state.meal = { type: state.meal.type, items: [], editing: -1 };
      analysisId += 1;
      if (photoUrl) { URL.revokeObjectURL(photoUrl); photoUrl = null; }
      el('photo-preview').removeAttribute('src');
      el('photo-frame').classList.remove('has-photo', 'is-busy');
      photoNote('');
      renderGuesses([]);
    }

    el('add-item').addEventListener('click', function () {
      state.meal.items.push({ name: '', grams: '', kcal: '' });
      state.meal.editing = state.meal.items.length - 1;
      renderMeal();
      save();
      var input = el('meal-items').querySelector('.item-wrap.is-editing .editor input');
      if (input) { input.focus(); }
    });

    el('save-meal').addEventListener('click', function () {
      var m = mealTotals();
      if (!m.kcal) { return; }
      state.entries.push({
        time: nowLabel(), kind: 'food', key: 'meal.' + state.meal.type, kcal: m.kcal
      });
      resetMeal();
      save();
      renderHome();
      renderMeal();
      goBack();
      toast(t('photo.saved', { kcal: num(m.kcal) }));
    });

    el('p-weight').addEventListener('change', function () {
      var w = parseFloat(String(this.value).replace(',', '.'));
      if (!isNaN(w) && w > 20 && w < 400) {
        state.weight = Math.round(w * 10) / 10;
        save();
        renderActivity();
      }
      this.value = state.weight;
    });

    el('lang-switch').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]');
      if (!b) { return; }
      state.lang = b.getAttribute('data-lang');
      save();
      renderAll();
    });

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'btn btn--quiet';
    reset.style.margin = '0 22px';
    reset.setAttribute('data-i18n', 'prof.reset');
    reset.addEventListener('click', function () {
      state.entries = seedEntries();
      save();
      renderHome();
      toast(t('prof.resetDone'));
    });
    var disclaimer = document.querySelector('#screen-profile .disclaimer');
    disclaimer.parentNode.insertBefore(reset, disclaimer);
  }

  /* ---------------- version ---------------- */

  /* version.json is written by the Pages workflow at deploy time. Missing it means
     the prototype is being served locally, which is worth showing plainly. */

  var loadedVersion = null;

  function fetchVersion() {
    return fetch('./version.json?ts=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function showVersion(info) {
    var node = el('app-version');
    if (!info) {
      node.textContent = t('prof.dev');
      return;
    }
    var built = info.built ? new Date(info.built) : null;
    node.textContent = info.version + (built && !isNaN(built)
      ? ' · ' + built.toLocaleDateString(state.lang === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      })
      : '');
  }

  function setupVersion() {
    fetchVersion().then(function (info) {
      loadedVersion = info && info.version;
      showVersion(info);
    });

    el('check-update').addEventListener('click', function () {
      var btn = this;
      btn.disabled = true;
      toast(t('prof.checking'));

      Promise.all([
        fetchVersion(),
        'serviceWorker' in navigator
          ? navigator.serviceWorker.getRegistration().then(function (reg) {
            return reg ? reg.update().catch(function () { return null; }) : null;
          })
          : Promise.resolve(null)
      ]).then(function (results) {
        var info = results[0];
        btn.disabled = false;
        showVersion(info);
        var latest = info && info.version;
        if (latest && loadedVersion && latest === loadedVersion) {
          toast(t('prof.upToDate'));
          return;
        }
        toast(t('prof.updating'));
        setTimeout(function () { location.reload(); }, 900);
      });
    });
  }

  /* ---------------- install prompt ---------------- */

  var DISMISS_KEY = 'fitbalance.install.dismissed';

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function installDismissed() {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch (err) { return false; }
  }

  function setupInstall() {
    var bar = el('install-bar');
    var sheet = el('ios-sheet');
    var deferred = null;

    function show() {
      if (isStandalone() || installDismissed()) { return; }
      bar.hidden = false;
    }

    function hide(remember) {
      bar.hidden = true;
      if (remember) {
        try { localStorage.setItem(DISMISS_KEY, '1'); } catch (err) { /* private mode */ }
      }
    }

    // Chrome and Edge: keep the browser's own mini-infobar away and use our button.
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      show();
    });

    window.addEventListener('appinstalled', function () {
      deferred = null;
      hide(false);
      toast(t('install.done'));
    });

    el('install-go').addEventListener('click', function () {
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.then(function (choice) {
          deferred = null;
          if (choice && choice.outcome === 'accepted') { hide(false); }
        });
        return;
      }
      sheet.hidden = false;
    });

    el('install-close').addEventListener('click', function () { hide(true); });
    el('ios-close').addEventListener('click', function () { sheet.hidden = true; });
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) { sheet.hidden = true; }
    });

    // Safari never fires beforeinstallprompt, so offer the manual route on iOS directly.
    if (isIos()) { setTimeout(show, 1200); }
  }

  /* ---------------- start ---------------- */

  load();

  // ?seed=meal fills the meal with a recognition result. Used by tools/make-screenshots.sh
  // and handy for demos; it never runs on its own.
  if (new URLSearchParams(location.search).get('seed') === 'meal') {
    var seeded = ['cheeseburger', 'corn'].map(function (id) {
      return itemFromFood(FoodRecognition.byId(id));
    });
    state.meal = { type: 'lunch', items: seeded, editing: 0 };
  }

  wire();
  renderAll();
  setupVersion();
  setupInstall();
  var initial = (location.hash || '#home').slice(1);
  go(document.getElementById('screen-' + initial) ? initial : 'home', true);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () { /* offline support is optional */ });
    });
  }
}());
