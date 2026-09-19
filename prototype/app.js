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
      'photo.privacy': 'Снимок разбирается на телефоне. Наружу он уходит, только если вы сами нажмёте «Уточнить в облаке».',

      'cloud.title': 'Облачное распознавание',
      'cloud.explain': 'Необязательно. Если вписать ключ, на экране фото появится кнопка «Уточнить в облаке» — она отправляет один снимок выбранной модели. Без неё всё остаётся на телефоне.',
      'cloud.provider': 'Провайдер', 'cloud.custom': 'Свой',
      'cloud.key': 'API-ключ', 'cloud.model': 'Модель', 'cloud.endpoint': 'Эндпоинт',
      'cloud.storage': 'Ключ хранится только в этом браузере и уходит только на указанный эндпоинт.',
      'cloud.getDeepseek': 'Где взять ключ: зарегистрируйтесь на platform.deepseek.com, пополните баланс (DeepSeek работает по предоплате) и создайте ключ в разделе API keys. Ключ показывают один раз — скопируйте сразу.',
      'cloud.getOpenai': 'Где взять ключ: platform.openai.com, раздел API keys. Нужен оплаченный баланс; ключ показывают один раз.',
      'cloud.getGemini': 'Где взять ключ: Google AI Studio, кнопка Create API key. Есть бесплатный лимит.',
      'cloud.getGeneric': 'Ключ берётся в личном кабинете вашего провайдера — там же, где он выдаёт API-доступ.',
      'cloud.openPage': 'Открыть страницу ключей →',

      'dev.title': 'Для разработчика', 'dev.mode': 'Режим разработчика',
      'dev.off': 'Выключен', 'dev.on': 'Включён',
      'dev.hint': 'Показывает под снимком полный ответ модели: что она вернула, сколько это заняло и сколько стоило токенов.',
      'dev.rawTitle': 'Ответ модели',
      'dev.meta': '{model} · {status} · {ms} мс · снимок {kb} КБ',
      'dev.tokens': 'токены: {prompt} + {completion} = {total}',
      'dev.finish': 'finish_reason: {reason}',
      'dev.reasoning': 'скрытых рассуждений: {tokens} токенов',
      'dev.salvaged': 'ответ был обрезан — позиции собраны из уцелевшей части',
      'dev.error': 'ошибка: {message}',
      'dev.parsed': 'принято позиций: {count}',
      'cloud.refine': 'Уточнить в облаке', 'cloud.sending': 'Отправляю снимок…',
      'cloud.willSend': 'Снимок уйдёт в {model}. Это единственный случай, когда фото покидает телефон.',
      'cloud.needKey': 'Чтобы включить, впишите API-ключ в профиле.',
      'cloud.done': '{model}: {count} — проверьте вес и калории.',
      'cloud.nothing': '{model} не нашла еду на снимке.',
      'cloud.truncated': 'Ответ {model} оборвался на полпути — не хватило лимита. Попробуйте ещё раз.',
      'cloud.failed': 'Облако не ответило: {message}',
      'cloud.badKey': 'Ключ не принят ({status}). Проверьте его в профиле.',
      'cloud.blocked': 'Не удалось связаться с {host}: нет сети, либо сервис не принимает запросы прямо со страницы (CORS) — тогда нужен прокси.',
      'cloud.timeout': 'Облако не ответило за 45 секунд.',
      'photo.mealType': 'Приём пищи', 'photo.items': 'Состав · можно поправить',
      'photo.emptyItems': 'Снимите фото или добавьте продукт вручную.',
      'photo.total': 'Итого', 'photo.totalWeight': '{g} г всего',
      'photo.addProduct': 'Добавить продукт', 'photo.save': 'Записать в дневник',
      'photo.saved': 'Записано: +{kcal} ккал',

      'entry.time': 'Время',
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

      'stats.eyebrow': 'FitBalance · статистика', 'stats.accumulated': 'накопленный дефицит в жировом эквиваленте',
      'stats.perDay': 'Дефицит по дням · цель {target}', 'stats.toNextKg': 'До эквивалента {kg} кг',
      'stats.remaining': 'ещё {kcal} ккал', 'stats.last30': 'Последние 30 дней',
      'stats.surplus': 'профицит', 'stats.deficit': 'дефицит',
      'stats.week': 'Неделя', 'stats.month': 'Месяц', 'stats.year': 'Год',
      'stats.accumulatedSurplus': 'накопленный профицит в жировом эквиваленте',
      'hist.eyebrow': 'FitBalance · дни', 'hist.title': 'ИСТОРИЯ',
      'hist.today': 'Сегодня', 'hist.empty': 'Пока ни одного записанного дня',

      'prof.title': 'ВАШИ НАСТРОЙКИ', 'prof.body': 'Данные тела', 'prof.sex': 'Пол', 'prof.male': 'Мужской',
      'prof.female': 'Женский',
      'prof.age': 'Возраст', 'prof.height': 'Рост, см', 'prof.weight': 'Вес, кг',
      'prof.goalNorm': 'Цель и норма', 'prof.lose': 'Похудение', 'prof.maintain': 'Поддержание веса',
      'prof.deficitPerDay': 'Дефицит в день', 'prof.calculated': 'рассчитано по данным тела',
      'prof.manualNorm': 'задано вручную', 'prof.recalc': 'Считать по данным тела',
      'prof.perDayGrams': '≈ {g} г в день',
      'prof.activitySource': 'Откуда берётся активность', 'prof.manual': 'Ввод вручную',
      'prof.manualHint': 'Вид, время, интенсивность — и приложение считает ккал',
      'prof.healthConnect': 'Health Connect', 'prof.healthHint': 'Android, в следующей версии', 'prof.later': 'Позже',
      'prof.language': 'Язык',
      'prof.disclaimer': 'Фото разбираются на устройстве; наружу снимок уходит только по кнопке «Уточнить в облаке». Жировой эквивалент (7 700 ккал = 1 кг) — условный ориентир, а не измерение состава тела.',
      'prof.reset': 'Сбросить данные до демо', 'prof.resetDone': 'Данные сброшены',

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

      'weekdays': ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
      'months': ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
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
      'photo.privacy': 'The picture is analysed on the phone. It only leaves it if you press "Ask the cloud" yourself.',

      'cloud.title': 'Cloud recognition',
      'cloud.explain': 'Optional. With a key set, the photo screen gets an "Ask the cloud" button that sends one picture to the model you choose. Without it, everything stays on the phone.',
      'cloud.provider': 'Provider', 'cloud.custom': 'Custom',
      'cloud.key': 'API key', 'cloud.model': 'Model', 'cloud.endpoint': 'Endpoint',
      'cloud.storage': 'The key is kept in this browser only, and is sent to the configured endpoint and nowhere else.',
      'cloud.getDeepseek': 'Where to get one: sign up at platform.deepseek.com, top up the balance (DeepSeek bills up front), then create a key under API keys. The key is shown once — copy it straight away.',
      'cloud.getOpenai': 'Where to get one: platform.openai.com, under API keys. Needs a funded balance; the key is shown once.',
      'cloud.getGemini': 'Where to get one: Google AI Studio, the Create API key button. It has a free tier.',
      'cloud.getGeneric': 'The key comes from your provider\u2019s own dashboard, wherever it hands out API access.',
      'cloud.openPage': 'Open the keys page →',

      'dev.title': 'Developer', 'dev.mode': 'Developer mode',
      'dev.off': 'Off', 'dev.on': 'On',
      'dev.hint': 'Shows the model\u2019s full reply under the picture: what came back, how long it took and what it cost in tokens.',
      'dev.rawTitle': 'Model reply',
      'dev.meta': '{model} · {status} · {ms} ms · image {kb} KB',
      'dev.tokens': 'tokens: {prompt} + {completion} = {total}',
      'dev.finish': 'finish_reason: {reason}',
      'dev.reasoning': 'hidden reasoning: {tokens} tokens',
      'dev.salvaged': 'the reply was truncated — items recovered from what survived',
      'dev.error': 'error: {message}',
      'dev.parsed': 'items accepted: {count}',
      'cloud.refine': 'Ask the cloud', 'cloud.sending': 'Sending the picture…',
      'cloud.willSend': 'The picture goes to {model}. This is the only time a photo leaves the phone.',
      'cloud.needKey': 'Add an API key in the profile to enable this.',
      'cloud.done': '{model}: {count} — check the weights and calories.',
      'cloud.nothing': '{model} found no food in the picture.',
      'cloud.truncated': 'The reply from {model} was cut off mid-sentence — it ran out of budget. Try again.',
      'cloud.failed': 'The cloud did not answer: {message}',
      'cloud.badKey': 'The key was refused ({status}). Check it in the profile.',
      'cloud.blocked': 'Could not reach {host}: either there is no network, or the service refuses calls straight from a page (CORS), which needs a proxy.',
      'cloud.timeout': 'The cloud did not answer within 45 seconds.',
      'photo.mealType': 'Meal', 'photo.items': 'Contents · editable',
      'photo.emptyItems': 'Take a photo, or add an item by hand.',
      'photo.total': 'Total', 'photo.totalWeight': '{g} g in total',
      'photo.addProduct': 'Add an item', 'photo.save': 'Save to diary',
      'photo.saved': 'Saved: +{kcal} kcal',

      'entry.time': 'Time',
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

      'stats.eyebrow': 'FitBalance · statistics', 'stats.accumulated': 'accumulated deficit as fat equivalent',
      'stats.perDay': 'Deficit per day · target {target}', 'stats.toNextKg': 'To {kg} kg equivalent',
      'stats.remaining': '{kcal} kcal to go', 'stats.last30': 'Last 30 days',
      'stats.surplus': 'surplus', 'stats.deficit': 'deficit',
      'stats.week': 'Week', 'stats.month': 'Month', 'stats.year': 'Year',
      'stats.accumulatedSurplus': 'accumulated surplus in fat equivalent',
      'hist.eyebrow': 'FitBalance · days', 'hist.title': 'HISTORY',
      'hist.today': 'Today', 'hist.empty': 'No day recorded yet',

      'prof.title': 'YOUR SETTINGS', 'prof.body': 'Body data', 'prof.sex': 'Sex', 'prof.male': 'Male',
      'prof.female': 'Female',
      'prof.age': 'Age', 'prof.height': 'Height, cm', 'prof.weight': 'Weight, kg',
      'prof.goalNorm': 'Goal and requirement', 'prof.lose': 'Lose weight', 'prof.maintain': 'Maintain weight',
      'prof.deficitPerDay': 'Daily deficit', 'prof.calculated': 'calculated from the body data',
      'prof.manualNorm': 'set by hand', 'prof.recalc': 'Calculate from the body data',
      'prof.perDayGrams': '≈ {g} g per day',
      'prof.activitySource': 'Where activity comes from', 'prof.manual': 'Manual entry',
      'prof.manualHint': 'Type, duration, intensity — the app does the calories',
      'prof.healthConnect': 'Health Connect', 'prof.healthHint': 'Android, next release', 'prof.later': 'Later',
      'prof.language': 'Language',
      'prof.disclaimer': 'Photos are analysed on the device; a picture only leaves it through the "Ask the cloud" button. The fat equivalent (7,700 kcal = 1 kg) is a conventional figure, not a body-composition measurement.',
      'prof.reset': 'Reset the data to demo', 'prof.resetDone': 'Data reset',

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

      'weekdays': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  /* ---------------- domain ---------------- */

  var MET = { walking: 3.8, running: 9.8, gym: 5.0, cycling: 7.5, swimming: 7.0, chores: 3.3 };
  var INTENSITY = { light: 0.8, moderate: 1.0, high: 1.3 };
  var ACTIVITY_TYPES = ['walking', 'running', 'gym', 'cycling', 'swimming', 'chores'];
  var DURATION_PRESETS = [15, 30, 45, 60, 90];

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

  /* ---------------- days ---------------- */

  function dateKey(date) {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  function todayKey() { return dateKey(new Date()); }

  function dayBefore(date, back) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - back);
  }

  /* Demo history, so a fresh install has charts with something in them. The
     numbers are generated from the day index rather than randomly, so the same
     day always looks the same. */
  function seedHistory(days, norm) {
    var history = {};
    var now = new Date();
    for (var back = 1; back <= days; back += 1) {
      // Mostly days in deficit, a few over - the shape a real month tends to have.
      var wanted = back % 9 === 4
        ? -260
        : Math.round(520 + Math.sin(back * 1.7) * 260 + Math.cos(back * 0.6) * 90);
      var burned = back % 7 === 3 ? 0 : Math.round(260 + Math.sin(back * 2.3) * 180);
      history[key(back)] = {
        eaten: norm + burned - wanted,
        burned: burned,
        maintenance: norm
      };
    }
    function key(back) { return dateKey(dayBefore(now, back)); }
    return history;
  }

  function sumEntries(entries) {
    var eaten = 0, burned = 0;
    entries.forEach(function (e) {
      if (e.kind === 'food') { eaten += e.kcal; } else { burned += e.kcal; }
    });
    return { eaten: eaten, burned: burned };
  }

  /* Midnight passed: today's entries become a closed day and the diary is empty
     again. Called on load and whenever the app comes back to the foreground. */
  function rollOverDay() {
    var key = todayKey();
    if (state.today === key) { return false; }
    if (state.today && state.entries.length) {
      var sums = sumEntries(state.entries);
      state.history[state.today] = {
        eaten: sums.eaten, burned: sums.burned, maintenance: maintenance()
      };
    }
    state.today = key;
    state.entries = [];
    state.editingEntry = -1;
    state.meal = { type: state.meal.type, items: [], editing: -1 };
    save();
    return true;
  }

  /* Today is read from the live diary; earlier days from the closed record, so
     a change to the maintenance figure never rewrites the past. */
  function dayStats(key) {
    if (key === state.today) {
      var sums = sumEntries(state.entries);
      return {
        key: key, eaten: sums.eaten, burned: sums.burned,
        maintenance: maintenance(), isToday: true
      };
    }
    var day = state.history[key];
    if (!day) { return null; }
    return {
      key: key, eaten: day.eaten, burned: day.burned,
      maintenance: day.maintenance, isToday: false
    };
  }

  function dayDeficit(day) { return day.maintenance + day.burned - day.eaten; }

  function gramsOf(kcal) { return Math.round(Math.abs(kcal) / KCAL_PER_KG * 1000); }

  /* The last `count` days, oldest first. Days with nothing recorded are present
     but marked, so a chart shows a gap rather than dropping a column. */
  function lastDays(count) {
    var now = new Date();
    var out = [];
    for (var back = count - 1; back >= 0; back -= 1) {
      var key = dateKey(dayBefore(now, back));
      out.push(dayStats(key) || {
        key: key, eaten: 0, burned: 0, maintenance: maintenance(), empty: true
      });
    }
    return out;
  }

  /* Every day on record, newest first — what the history screen lists. */
  function recordedDays() {
    var keys = Object.keys(state.history);
    if (keys.indexOf(state.today) === -1) { keys.push(state.today); }
    return keys.sort().reverse().map(function (key) { return dayStats(key); })
      .filter(function (day) { return !!day; });
  }

  function accumulatedDeficit() {
    return recordedDays().reduce(function (sum, day) { return sum + dayDeficit(day); }, 0);
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

  function itemFromCloud(item) {
    return {
      cloud: true,
      name: item.name,
      grams: item.grams,
      kcal: item.kcal,
      per100: item.per100
    };
  }

  var MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner'];

  var state = {
    lang: 'ru',
    sex: 'male',
    age: 34,
    height: 182,
    weight: 84.5,
    maintenance: null,          // null = derived from the body data below
    target: 700,
    statsPeriod: 'week',
    today: null,                // the date `entries` belong to
    entries: seedEntries(),
    editingEntry: -1,
    history: null,              // date -> closed day; filled with demo days on first run
    draft: { type: 'walking', minutes: 45, intensity: 'moderate', manual: '' },
    meal: { type: 'lunch', items: [], editing: -1 },
    // Optional second opinion. Keys never leave this browser, and are kept per
    // provider host so switching between them does not overwrite one another.
    cloud: { keys: {}, model: '', endpoint: '' },
    devMode: false
  };

  function mealTotals() {
    var kcal = 0, grams = 0;
    state.meal.items.forEach(function (it) {
      kcal += Number(it.kcal) || 0;
      grams += Number(it.grams) || 0;
    });
    return { kcal: Math.round(kcal), grams: Math.round(grams) };
  }

  /* Mifflin-St Jeor resting metabolic rate, times 1.2 for ordinary daily
     movement. Deliberately *not* an activity multiplier on top of that:
     workouts are entered by hand and added as their own line, so a higher
     multiplier here would count them twice. */
  function calculatedMaintenance() {
    var base = 10 * state.weight + 6.25 * state.height - 5 * state.age;
    var rmr = state.sex === 'female' ? base - 161 : base + 5;
    return Math.round(rmr * 1.2 / 10) * 10;
  }

  function maintenance() {
    return state.maintenance === null || state.maintenance === undefined
      ? calculatedMaintenance()
      : state.maintenance;
  }

  function totals() {
    var sums = sumEntries(state.entries);
    var deficit = maintenance() + sums.burned - sums.eaten;
    return {
      eaten: sums.eaten,
      burned: sums.burned,
      deficit: deficit,
      leftToBurn: Math.max(0, state.target - deficit),
      grams: gramsOf(deficit)
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

  /* "СР 17.09" / "WED 17.09" for the home screen. */
  function dateLabel(date) {
    var weekday = COPY[state.lang].weekdays[(date.getDay() + 6) % 7];
    return (weekday + ' ' + String(date.getDate()).padStart(2, '0') + '.' +
      String(date.getMonth() + 1).padStart(2, '0')).toUpperCase();
  }

  function parseKey(key) {
    var parts = key.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }


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
    el('today-date').textContent = dateLabel(new Date());
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
    el('m-norm').textContent = num(maintenance());

    document.querySelector('[data-i18n="home.deficitNow"]').textContent =
      s.deficit >= 0 ? t('home.deficitNow') : t('home.surplusNow');
    el('deficit-kcal').textContent = num(Math.abs(s.deficit));
    el('deficit-grams').textContent = t('unit.kcal') + ' · ≈ ' + num(s.grams) + ' ' + t('unit.g');

    /* The two roll-ups next to the deficit card: a week in grams, a month in
       kilograms, both of fat equivalent. */
    var week = lastDays(7).reduce(function (sum, d) { return sum + (d.empty ? 0 : dayDeficit(d)); }, 0);
    var month = lastDays(30).reduce(function (sum, d) { return sum + (d.empty ? 0 : dayDeficit(d)); }, 0);
    el('home-7').innerHTML = (week >= 0 ? '−' : '+') + num(gramsOf(week)) +
      ' <span>' + t('unit.g') + '</span>';
    el('home-30').innerHTML = (month >= 0 ? '−' : '+') +
      num(Math.round(Math.abs(month) / KCAL_PER_KG * 10) / 10) +
      ' <span>' + t('unit.kg') + '</span>';

    var feed = el('feed');
    feed.innerHTML = '';
    if (!state.entries.length) {
      feed.innerHTML = '<div class="feed__empty">' + t('home.empty') + '</div>';
      return;
    }
    // Newest first, by the clock rather than by the order things were added -
    // an entry whose time was edited has to move with it.
    byTimeDescending(state.entries).forEach(function (e) {
      var index = state.entries.indexOf(e);
      var wrap = document.createElement('div');
      wrap.className = 'feed__wrap' + (state.editingEntry === index ? ' is-editing' : '');

      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'feed__row';
      var burn = e.kind === 'activity';
      row.innerHTML =
        '<div class="feed__time"></div>' +
        '<div class="feed__name"></div>' +
        '<div class="feed__kcal' + (burn ? ' is-burn' : '') + '"></div>';
      row.children[0].textContent = e.time;
      row.children[1].textContent = t(e.key);
      row.children[2].textContent = (burn ? '−' : '+') + num(e.kcal);
      row.addEventListener('click', function () {
        state.editingEntry = state.editingEntry === index ? -1 : index;
        renderHome();
      });
      wrap.appendChild(row);

      if (state.editingEntry === index) { wrap.appendChild(buildEntryEditor(e, index)); }
      feed.appendChild(wrap);
    });
  }

  function byTimeDescending(entries) {
    return entries.slice().sort(function (a, b) {
      return a.time === b.time ? 0 : (a.time < b.time ? 1 : -1);
    });
  }

  /* Tapping a diary entry opens it: the time, the calories and what it was are
     all editable, and it can be removed. */
  function buildEntryEditor(entry, index) {
    var box = document.createElement('div');
    box.className = 'editor';

    var pair = document.createElement('div');
    pair.className = 'editor__pair';

    var timeLabel = document.createElement('label');
    var timeCaption = document.createElement('span');
    timeCaption.className = 'editor__k';
    timeCaption.textContent = t('entry.time');
    var timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.value = entry.time;
    timeLabel.appendChild(timeCaption);
    timeLabel.appendChild(timeInput);

    var kcalField = numberField(t('editor.kcal'), entry.kcal);
    pair.appendChild(timeLabel);
    pair.appendChild(kcalField);
    box.appendChild(pair);

    var caption = document.createElement('div');
    caption.className = 'editor__k';
    caption.style.margin = '10px 0 0';
    caption.textContent = t(entry.kind === 'food' ? 'photo.mealType' : 'act.type');
    box.appendChild(caption);

    var chips = document.createElement('div');
    chips.className = 'chips chips--inline';
    chips.style.marginTop = '6px';
    var keys = entry.kind === 'food'
      ? MEAL_TYPES.map(function (k) { return 'meal.' + k; })
      : ACTIVITY_TYPES.map(function (k) { return 'act.' + k; });
    keys.forEach(function (key) {
      chips.appendChild(button(t(key), entry.key === key, function () {
        entry.key = key;
        save();
        renderHome();
      }, 'chip'));
    });
    box.appendChild(chips);

    var row = document.createElement('div');
    row.className = 'editor__row';
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'editor__del';
    del.textContent = t('editor.delete');
    var done = document.createElement('button');
    done.type = 'button';
    done.className = 'editor__done';
    done.textContent = t('editor.done');
    row.appendChild(del);
    row.appendChild(done);
    box.appendChild(row);

    timeInput.addEventListener('change', function () {
      if (!this.value) { this.value = entry.time; return; }
      entry.time = this.value;
      save();
      renderHome();
    });

    kcalField.__input.addEventListener('change', function () {
      var value = parseInt(String(this.value).replace(',', '.'), 10);
      if (!isNaN(value) && value >= 0 && value <= 20000) {
        entry.kcal = value;
        save();
        renderHome();
      } else {
        this.value = entry.kcal;
      }
    });

    del.addEventListener('click', function () {
      state.entries.splice(index, 1);
      state.editingEntry = -1;
      save();
      renderHome();
    });

    done.addEventListener('click', function () {
      state.editingEntry = -1;
      renderHome();
    });

    return box;
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

  var STATS_PERIODS = { week: 7, month: 30, year: 365 };

  /* Year view is twelve monthly columns; the shorter views are one column per
     day. Both come out as { value, label, isNow } so the chart draws either. */
  function statsColumns(period) {
    if (period !== 'year') {
      return lastDays(STATS_PERIODS[period]).map(function (day) {
        var date = parseKey(day.key);
        return {
          value: day.empty ? 0 : dayDeficit(day),
          label: period === 'week'
            ? COPY[state.lang].weekdays[(date.getDay() + 6) % 7]
            : String(date.getDate()),
          isNow: day.isToday
        };
      });
    }

    var now = new Date();
    var buckets = [];
    for (var back = 11; back >= 0; back -= 1) {
      var month = new Date(now.getFullYear(), now.getMonth() - back, 1);
      buckets.push({ year: month.getFullYear(), month: month.getMonth(), total: 0 });
    }
    recordedDays().forEach(function (day) {
      var date = parseKey(day.key);
      for (var i = 0; i < buckets.length; i += 1) {
        if (buckets[i].year === date.getFullYear() && buckets[i].month === date.getMonth()) {
          buckets[i].total += dayDeficit(day);
          return;
        }
      }
    });
    return buckets.map(function (bucket, i) {
      return {
        value: bucket.total,
        label: COPY[state.lang].months[bucket.month],
        isNow: i === buckets.length - 1
      };
    });
  }

  function renderStats() {
    var seg = el('stats-period');
    var periods = ['week', 'month', 'year'];
    if (!seg.children.length) {
      periods.forEach(function (key, i) {
        seg.appendChild(button(t('stats.' + key), i === 0, function () {
          state.statsPeriod = key;
          save();
          renderStats();
        }));
      });
    }
    periods.forEach(function (key, i) {
      seg.children[i].textContent = t('stats.' + key);
      seg.children[i].setAttribute('aria-pressed', state.statsPeriod === key ? 'true' : 'false');
    });

    var columns = statsColumns(state.statsPeriod);
    var periodTotal = columns.reduce(function (sum, c) { return sum + c.value; }, 0);
    var accumulated = accumulatedDeficit();

    el('stats-title').innerHTML = '≈ ' + (accumulated >= 0 ? '−' : '+') +
      num(Math.round(Math.abs(accumulated) / KCAL_PER_KG * 10) / 10) +
      ' <span data-i18n="unit.kg">' + t('unit.kg') + '</span>';
    document.querySelector('[data-i18n="stats.accumulated"]').textContent =
      t(accumulated >= 0 ? 'stats.accumulated' : 'stats.accumulatedSurplus');

    el('stats-period-label').textContent = t('stats.perDay', { target: num(state.target) });
    el('stats-period-total').innerHTML = (periodTotal >= 0 ? '−' : '+') +
      num(gramsOf(periodTotal)) + ' <span>' + t('unit.g') + '</span>';

    /* One scale for both halves of the chart, taken from the tallest column, so
       a surplus bar and a deficit bar of the same size look the same. */
    var peak = columns.reduce(function (max, c) { return Math.max(max, Math.abs(c.value)); }, 1);
    var pos = el('chart-pos'), neg = el('chart-neg'), days = el('chart-days');
    pos.innerHTML = ''; neg.innerHTML = ''; days.innerHTML = '';
    columns.forEach(function (column) {
      var up = document.createElement('div');
      up.className = 'chart__col';
      var down = document.createElement('div');
      down.className = 'chart__col';
      var bar = document.createElement('div');
      bar.className = 'chart__bar';
      var height = Math.round(Math.abs(column.value) / peak * 86);

      if (column.value < 0) {                 // a surplus day sits above the axis
        bar.classList.add('is-surplus');
        bar.style.height = Math.min(26, height) + 'px';
        bar.style.borderRadius = '4px 4px 0 0';
        up.appendChild(bar);
      } else {
        if (column.isNow) { bar.classList.add('is-today'); }
        bar.style.height = height + 'px';
        bar.style.borderRadius = '0 0 4px 4px';
        down.appendChild(bar);
      }
      pos.appendChild(up);
      neg.appendChild(down);

      var day = document.createElement('div');
      day.className = 'chart__day' + (column.isNow ? ' is-today' : '');
      day.textContent = column.label;
      days.appendChild(day);
    });
    days.classList.toggle('is-dense', columns.length > 14);

    /* The next half-kilo of fat equivalent, and what is left to reach it. */
    var kg = accumulated / KCAL_PER_KG;
    var milestone = (Math.floor(Math.abs(kg) / 0.5) + 1) * 0.5;
    var remaining = Math.round(milestone * KCAL_PER_KG - Math.abs(accumulated));
    el('stats-milestone').textContent = t('stats.toNextKg', {
      kg: num(kg >= 0 ? milestone : -milestone)
    });
    el('stats-remaining').textContent = t('stats.remaining', { kcal: num(remaining) });
    el('goal-fill').style.width =
      Math.max(2, Math.min(100, Math.round((1 - remaining / (0.5 * KCAL_PER_KG)) * 100))) + '%';

    /* Thirty days at a glance: one cell per day, shaded by how close that day
       came to the deficit target. */
    var strip = el('strip');
    strip.innerHTML = '';
    var fills = ['#17120f', '#f6d9d8', '#e8807f', '#d8161d'];
    lastDays(30).forEach(function (day) {
      var cell = document.createElement('div');
      var deficit = day.empty ? 0 : dayDeficit(day);
      var level = deficit <= 0 ? 0
        : deficit < state.target * 0.5 ? 1
        : deficit < state.target ? 2
        : 3;
      cell.style.background = fills[level];
      cell.title = day.key;
      strip.appendChild(cell);
    });
  }

  function renderHistory() {
    var list = el('history-list');
    list.innerHTML = '';
    var days = recordedDays();
    if (!days.length) {
      list.innerHTML = '<div class="feed__empty">' + t('hist.empty') + '</div>';
      return;
    }
    days.forEach(function (day) {
      var deficit = dayDeficit(day);
      var row = document.createElement('div');
      row.className = 'day';
      row.innerHTML =
        '<div class="day__head">' +
          '<span class="day__date"></span>' +
          '<span class="day__kcal"></span>' +
        '</div>' +
        '<div class="day__sub"></div>';
      row.querySelector('.day__date').textContent = day.isToday
        ? t('hist.today')
        : dateLabel(parseKey(day.key));
      var kcal = row.querySelector('.day__kcal');
      kcal.textContent = (deficit >= 0 ? '−' : '+') + num(Math.abs(deficit)) + ' ' + t('unit.kcal');
      kcal.className = 'day__kcal' + (deficit >= 0 ? ' is-deficit' : ' is-surplus');
      row.querySelector('.day__sub').textContent =
        t('home.eaten') + ' ' + num(day.eaten) + ' · ' +
        t('home.burned') + ' ' + num(day.burned) + ' · ≈ ' + num(gramsOf(deficit)) + ' ' + t('unit.g');
      list.appendChild(row);
    });
  }

  function renderProfile() {
    var manual = state.maintenance !== null && state.maintenance !== undefined;
    el('p-target').value = state.target;
    el('p-norm').value = maintenance();
    el('p-norm-note').textContent = t(manual ? 'prof.manualNorm' : 'prof.calculated');
    el('p-norm-reset').hidden = !manual;
    el('p-target-g').textContent = t('prof.perDayGrams', {
      g: num(Math.round(state.target / KCAL_PER_KG * 1000))
    });
    el('p-goal').textContent = t(state.target > 0 ? 'prof.lose' : 'prof.maintain');
    renderCloudHelp();
    renderCloudSettings();
    Array.prototype.forEach.call(el('dev-switch').children, function (b) {
      b.setAttribute('aria-pressed',
        (b.getAttribute('data-dev') === 'on') === !!state.devMode ? 'true' : 'false');
    });
    el('p-age').value = state.age;
    el('p-height').value = state.height;
    el('p-weight').value = state.weight;
    Array.prototype.forEach.call(el('p-sex').children, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-sex') === state.sex ? 'true' : 'false');
    });
    Array.prototype.forEach.call(el('lang-switch').children, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === state.lang ? 'true' : 'false');
    });
  }

  /* Set by wire(); the photo screen owns the button, but a language switch has
     to reach it from here. */
  var refreshCloudButton = function () {};

  /* The endpoint is a free-text field, so the "where do I get a key" line
     follows whatever provider is actually configured. */
  var KEY_SOURCES = [
    { host: 'deepseek', copy: 'cloud.getDeepseek', url: 'https://platform.deepseek.com/api_keys' },
    { host: 'openai', copy: 'cloud.getOpenai', url: 'https://platform.openai.com/api-keys' },
    { host: 'googleapis', copy: 'cloud.getGemini', url: 'https://aistudio.google.com/apikey' },
    { host: 'google', copy: 'cloud.getGemini', url: 'https://aistudio.google.com/apikey' }
  ];

  function keySource(endpoint) {
    /* Matched on the host alone: Gemini's compatibility endpoint carries
       "openai" in its path, which would otherwise claim it for OpenAI. */
    var host = String(endpoint || '').toLowerCase();
    try { host = new URL(endpoint).host.toLowerCase(); } catch (err) { /* as typed */ }
    for (var i = 0; i < KEY_SOURCES.length; i += 1) {
      if (host.indexOf(KEY_SOURCES[i].host) !== -1) { return KEY_SOURCES[i]; }
    }
    return null;
  }

  /* The provider picker, the key field and the two text fields are one unit:
     the endpoint decides which stored key is shown, so they redraw together. */
  function renderCloudSettings() {
    var config = CloudRecognition.settings(state.cloud);
    var picker = el('cloud-providers');
    var known = CloudRecognition.providers();
    var current = CloudRecognition.providerOf(config.endpoint);

    if (!picker.children.length) {
      known.forEach(function (provider) {
        picker.appendChild(button(provider.label, false, function () {
          /* A preset moves the endpoint and the model only. The key for that
             host is already stored under it and comes back on its own. */
          state.cloud.endpoint = provider.endpoint;
          state.cloud.model = provider.model;
          save();
          renderCloudSettings();
          refreshCloudButton();
          renderCloudHelp();
        }));
      });
      picker.appendChild(button(t('cloud.custom'), false, function () {
        el('cloud-endpoint').focus();
        el('cloud-endpoint').select();
      }));
    }
    Array.prototype.forEach.call(picker.children, function (node, i) {
      var id = i < known.length ? known[i].id : 'custom';
      node.textContent = i < known.length ? known[i].label : t('cloud.custom');
      node.setAttribute('aria-pressed',
        (current ? current.id : 'custom') === id ? 'true' : 'false');
    });

    /* The fields show what would actually be sent, defaults included, rather
       than an empty box with a placeholder nobody can be sure applies. */
    el('cloud-key').value = config.key;
    el('cloud-model').value = config.model;
    el('cloud-endpoint').value = config.endpoint;
  }

  /* Developer mode. The last exchange is held in memory only: a raw reply runs
     to a couple of kilobytes and has no business in localStorage. */
  var lastExchange = null;

  function rememberExchange(debug, parsedCount) {
    if (!debug) { return; }
    debug.parsedCount = parsedCount;
    lastExchange = debug;
    renderRawReply();
  }

  function renderRawReply() {
    var box = el('cloud-raw');
    if (!state.devMode || !lastExchange) {
      box.hidden = true;
      return;
    }
    var debug = lastExchange;
    var lines = [t('dev.meta', {
      model: debug.model,
      status: debug.status === null ? '—' : debug.status,
      ms: debug.ms === null ? '—' : debug.ms,
      kb: debug.imageKb
    })];
    if (debug.usage) {
      lines.push(t('dev.tokens', {
        prompt: debug.usage.prompt_tokens != null ? debug.usage.prompt_tokens : '—',
        completion: debug.usage.completion_tokens != null ? debug.usage.completion_tokens : '—',
        total: debug.usage.total_tokens != null ? debug.usage.total_tokens : '—'
      }));
    }
    if (debug.reasoning) { lines.push(t('dev.reasoning', { tokens: num(debug.reasoning) })); }
    if (debug.finish) { lines.push(t('dev.finish', { reason: debug.finish })); }
    if (debug.salvaged) { lines.push(t('dev.salvaged')); }
    if (debug.parsedCount != null) { lines.push(t('dev.parsed', { count: debug.parsedCount })); }
    if (debug.error) { lines.push(t('dev.error', { message: debug.error })); }

    el('cloud-raw-summary').textContent = t('dev.rawTitle');
    el('cloud-raw-meta').textContent = lines.join('\n');
    el('cloud-raw-body').textContent = debug.raw || '—';
    box.hidden = false;
  }

  function renderCloudHelp() {
    var config = CloudRecognition.settings(state.cloud);
    var source = keySource(config.endpoint);
    var link = el('cloud-help-link');
    el('cloud-help-steps').textContent = t(source ? source.copy : 'cloud.getGeneric');
    if (source) {
      link.href = source.url;
      link.textContent = t('cloud.openPage');
      link.removeAttribute('hidden');
    } else {
      link.removeAttribute('href');
      link.textContent = '';
    }
  }

  function renderAll() {
    renderStaticCopy();
    renderHome();
    renderMeal();
    renderActivity();
    renderStats();
    renderHistory();
    renderProfile();
    refreshCloudButton();
    renderRawReply();
    renderProbe();
  }

  /* ---------------- navigation ---------------- */

  var MODALS = { photo: true, activity: true };

  /* Every forward move pushes a history entry, so the phone's own back gesture
     walks back through the app instead of leaving it. `navStack` mirrors that
     history by name, because the swipe gesture has to draw the screen it is
     about to return to. */
  var navDepth = 0;
  var navStack = [];

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
      navStack[Math.max(0, navStack.length - 1)] = name;
      return;
    }
    history.pushState({ screen: name }, '', '#' + name);
    navStack.push(name);
    navDepth += 1;
  }

  /* Returns true when a popstate is on its way, which the swipe gesture waits
     for before it tidies up: clearing earlier would flash a blank screen. */
  function goBack() {
    if (navDepth > 0) {
      history.back();
      return true;
    }
    go('home', true);           // deep link straight into a screen: nowhere to go back to
    return false;
  }

  /* What a back step would land on. A screen opened by deep link has nothing
     behind it, and home is where goBack() sends it. */
  function screenBehind() {
    if (navStack.length > 1) { return navStack[navStack.length - 2]; }
    var current = navStack[navStack.length - 1];
    return current && current !== 'home' ? 'home' : null;
  }

  window.addEventListener('popstate', function (e) {
    var name = (e.state && e.state.screen) || (location.hash || '#home').slice(1);
    if (!document.getElementById('screen-' + name)) { name = 'home'; }
    navDepth = Math.max(0, navDepth - 1);
    if (navStack.length > 1) { navStack.pop(); } else { navStack[0] = name; }
    show(name);

    var sheet = el('ios-sheet');
    if (sheet && !sheet.hidden) { sheet.hidden = true; }
  });

  /* ---------------- swipe gestures ---------------- */

  /* Two horizontal gestures, told apart by where they start and what screen
     they start on:

     - on a tab screen, a swipe moves between the four tabs, the way the tab bar
       does, with the neighbouring screen sliding in alongside;
     - on a modal screen (photo, activity), a drag from the left edge goes back,
       which an installed PWA on iOS has no other way to do.

     The tab swipe leaves the outer 30 px alone on both sides, because that is
     where the phone's own back gesture lives and arguing with it is a fight
     nobody wins. */
  var TAB_ORDER = ['home', 'history', 'stats', 'profile'];

  /* The back drag starts at the edge, so it needs a band to start in. The tab
     swipe reserves nothing: where a phone claims its own edge gesture it takes
     those touches before the page ever sees them, and where the page does see
     them the edge is ours to use. A reserved band only ever costs the user the
     most natural place to start a swipe - which is exactly how this looked
     broken on a real phone while passing every test on a desktop. */
  var BACK_EDGE = 30;        // px from the left edge where a back drag may start
  var COMMIT_RATIO = 0.25;   // how far across counts as a committed move
  var FLING_SPEED = 0.35;    // px/ms that commits regardless of distance
  var PEEK_RATIO = 0.25;     // how far the screen behind is held back when going back
  var SETTLE_MS = 220;

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
  }

  function screenName(node) {
    return node && node.id ? node.id.replace('screen-', '') : '';
  }

  /* A pre block or any other sideways-scrolling box owns horizontal drags that
     begin inside it. */
  function inHorizontalScroller(node) {
    while (node && node !== document.body) {
      if (node.scrollWidth > node.clientWidth + 4) {
        var overflow = window.getComputedStyle(node).overflowX;
        if (overflow === 'auto' || overflow === 'scroll') { return true; }
      }
      node = node.parentNode;
    }
    return false;
  }

  /* Developer-mode telemetry. Every decision the handler makes is written here,
     so a device that behaves unlike a desktop can be asked what it saw instead
     of being guessed at. */
  var probe = {
    starts: 0, moves: 0, ends: 0, cancels: 0,
    mode: '-', stop: '-', dx: 0, dy: 0, screen: '-', touchAction: '-'
  };

  function renderProbe() {
    var box = el('gesture-probe');
    if (!box) { return; }
    if (!state.devMode) { box.hidden = true; return; }
    box.hidden = false;
    box.textContent =
      'touch=' + ('ontouchstart' in window) + ' standalone=' + isStandalone() +
      ' w=' + Math.round(probe.width || 0) + '\n' +
      'start=' + probe.starts + ' move=' + probe.moves +
      ' end=' + probe.ends + ' cancel=' + probe.cancels + '\n' +
      'screen=' + probe.screen + ' mode=' + probe.mode +
      ' dx=' + Math.round(probe.dx) + ' dy=' + Math.round(probe.dy) + '\n' +
      'stop=' + probe.stop + ' touch-action=' + probe.touchAction;
  }

  function note(field, value) {
    probe[field] = value;
    renderProbe();
  }

  function setupSwipeGestures() {
    if (!('ontouchstart' in window)) { return; }

    var app = document.querySelector('.app');
    var surface = document;        // a drag can start on anything, so listen wide
    var mode = null;               // 'tab' or 'back'
    var dragged = null, partner = null, partnerName = '';
    var startX = 0, startY = 0, lastX = 0, startedAt = 0, width = 1;
    var decided = false, dragging = false;

    function paint(dx) {
      if (mode === 'back') {
        var progress = Math.min(1, dx / width);
        dragged.style.transform = 'translateX(' + dx + 'px)';
        partner.style.transform = 'translateX(' + (-PEEK_RATIO * width * (1 - progress)) + 'px)';
        return;
      }
      // Tabs travel together, like one strip being pulled sideways.
      dragged.style.transform = 'translateX(' + dx + 'px)';
      partner.style.transform = 'translateX(' + (dx + (dx < 0 ? width : -width)) + 'px)';
    }

    function clear() {
      if (dragged) {
        dragged.classList.remove('is-dragging', 'is-settling');
        dragged.style.transform = '';
      }
      if (partner) {
        partner.classList.remove('is-under', 'is-settling');
        partner.style.transform = '';
      }
      dragged = null;
      partner = null;
      partnerName = '';
      mode = null;
      dragging = false;
      decided = false;
    }

    function settle(commit, dx) {
      var leaving = dragged, arriving = partner, target = partnerName, kind = mode;
      leaving.classList.add('is-settling');
      arriving.classList.add('is-settling');

      var restingPlace = kind === 'back'
        ? 'translateX(' + (-PEEK_RATIO * width) + 'px)'
        : 'translateX(' + (dx < 0 ? width : -width) + 'px)';
      var exit = kind === 'back' ? width : (dx < 0 ? -width : width);

      leaving.style.transform = 'translateX(' + (commit ? exit + 'px' : '0px') + ')';
      arriving.style.transform = commit ? 'translateX(0px)' : restingPlace;

      setTimeout(function () {
        if (!commit) { clear(); return; }
        if (kind === 'tab') {
          go(target);
          clear();
          return;
        }
        /* goBack() answers whether a popstate is coming. Tidying up before the
           new screen is active would blank the display for a frame. */
        if (goBack()) {
          window.addEventListener('popstate', function once() {
            window.removeEventListener('popstate', once);
            clear();
          });
        } else {
          clear();
        }
      }, SETTLE_MS);
    }

    surface.addEventListener('touchstart', function (e) {
      probe.starts += 1;
      probe.stop = '-';
      probe.mode = '-';
      probe.dx = 0;
      probe.dy = 0;
      if (dragging || e.touches.length !== 1) { note('stop', 'busy/multitouch'); return; }
      var touch = e.touches[0];
      var active = document.querySelector('.screen.is-active');
      if (!active) { note('stop', 'no-active-screen'); return; }
      probe.screen = screenName(active);
      try {
        probe.touchAction = window.getComputedStyle(active).touchAction;
      } catch (err) { probe.touchAction = '?'; }

      width = app.getBoundingClientRect().width || window.innerWidth;
      var tab = TAB_ORDER.indexOf(screenName(active));

      probe.width = width;
      if (tab === -1) {
        // A modal screen: only the left edge, and only where nothing else claims it.
        if (!isStandalone()) { note('stop', 'modal-not-standalone'); return; }
        if (touch.clientX > BACK_EDGE) { note('stop', 'modal-not-edge'); return; }
        var previous = screenBehind();
        var under = previous && el('screen-' + previous);
        if (!previous || !under || under === active) { note('stop', 'nothing-behind'); return; }
        mode = 'back';
        partner = under;
        partnerName = previous;
      } else {
        if (inHorizontalScroller(e.target)) { note('stop', 'inside-scroller'); return; }
        mode = 'tab';
        partner = null;                      // chosen once the direction is known
        partnerName = '';
      }

      dragged = active;
      startX = touch.clientX;
      startY = touch.clientY;
      lastX = touch.clientX;
      startedAt = Date.now();
      decided = false;
      dragging = false;
      note('mode', mode);
    }, { passive: true });

    surface.addEventListener('touchmove', function (e) {
      probe.moves += 1;
      if (!dragged || e.touches.length !== 1) {
        if (!dragged && probe.stop === '-') { note('stop', 'no-drag-in-progress'); }
        return;
      }
      var touch = e.touches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      lastX = touch.clientX;

      if (!decided) {
        probe.dx = dx;
        probe.dy = dy;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) { return; }
        decided = true;
        // A mostly vertical move is the user scrolling, and stays theirs.
        if (Math.abs(dy) > Math.abs(dx)) { note('stop', 'vertical'); clear(); return; }

        if (mode === 'back') {
          if (dx <= 0) { clear(); return; }
        } else {
          var index = TAB_ORDER.indexOf(screenName(dragged));
          var next = TAB_ORDER[index + (dx < 0 ? 1 : -1)];
          if (!next) { note('stop', 'no-tab-that-way'); clear(); return; }
          partnerName = next;
          partner = el('screen-' + next);
          if (!partner) { clear(); return; }
        }
        dragging = true;
        dragged.classList.add('is-dragging');
        partner.classList.add('is-under');
        note('stop', 'dragging->' + partnerName);
      }
      if (!dragging) { return; }
      probe.dx = dx;
      probe.dy = dy;
      e.preventDefault();                   // the screens move, the page does not
      paint(mode === 'back' ? Math.max(0, dx) : dx);
    }, { passive: false });

    function release() {
      if (!dragged) { return; }
      if (!dragging) { clear(); return; }
      var dx = lastX - startX;
      if (mode === 'back') { dx = Math.max(0, dx); }
      var speed = Math.abs(dx) / Math.max(1, Date.now() - startedAt);
      settle(Math.abs(dx) > width * COMMIT_RATIO || speed > FLING_SPEED, dx);
    }

    surface.addEventListener('touchend', function () {
      probe.ends += 1;
      renderProbe();
      release();
    });
    surface.addEventListener('touchcancel', function () {
      probe.cancels += 1;
      note('stop', 'cancelled-by-browser');
      if (dragging) { settle(false, lastX - startX); } else { clear(); }
    });
  }

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
    var cloudBusy = false;

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
      state.meal.items = state.meal.items.filter(function (it) { return !it.food && !it.cloud; });
      state.meal.editing = -1;
      renderMeal();
      save();
    }

    // A recognition pass replaces earlier recognised items and leaves hand-typed ones alone.
    function applyFood(food) {
      var manual = state.meal.items.filter(function (it) { return !it.food && !it.cloud; });
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
      renderCloudButton();
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

    /* The cloud button only exists while there is a picture on screen. It is
       never automatic: sending the photo is a decision the user makes per shot,
       which is the whole reason the on-device promise survives having it. */
    function renderCloudButton() {
      var button = el('cloud-go');
      var hint = el('cloud-hint');
      var config = CloudRecognition.settings(state.cloud);
      var hasPhoto = el('photo-frame').classList.contains('has-photo');

      button.hidden = !hasPhoto;
      hint.textContent = '';
      if (!hasPhoto) { return; }

      if (!config.key) {
        button.disabled = true;
        el('cloud-go-text').textContent = t('cloud.refine');
        hint.textContent = t('cloud.needKey');
        return;
      }
      button.disabled = cloudBusy;
      el('cloud-go-text').textContent = t(cloudBusy ? 'cloud.sending' : 'cloud.refine');
      hint.textContent = t('cloud.willSend', { model: config.model });
    }

    function cloudFailureText(err) {
      var config = CloudRecognition.settings(state.cloud);
      if (err && (err.status === 401 || err.status === 403)) {
        return t('cloud.badKey', { status: err.status });
      }
      if (err && err.code === 'timeout') { return t('cloud.timeout'); }
      if (err && err.code === 'network') {
        var host = config.endpoint;
        try { host = new URL(config.endpoint).host; } catch (parseError) { /* keep as typed */ }
        return t('cloud.blocked', { host: host });
      }
      return t('cloud.failed', { message: (err && err.message) || 'unknown error' });
    }

    el('cloud-go').addEventListener('click', function () {
      var config = CloudRecognition.settings(state.cloud);
      if (cloudBusy || !config.key) { return; }
      var run = ++analysisId;
      var frame = el('photo-frame');

      cloudBusy = true;
      renderCloudButton();
      frame.classList.add('is-busy');
      photoStatus(t('cloud.sending'));
      photoNote('');
      renderGuesses([]);

      CloudRecognition.analyse(el('photo-preview'), {
        settings: state.cloud,
        lang: state.lang
      }).then(function (result) {
        if (run !== analysisId) { return; }
        rememberExchange(result.debug, result.items.length);
        if (!result.items.length) {
          /* Nothing usable came back, so what the on-device pass found stays
             where it is. A reply that ran out of budget is a different problem
             from one that saw no food, and saying so is the difference between
             "try again" and "give up". */
          var cutOff = result.debug && result.debug.finish === 'length';
          photoNote(t(cutOff ? 'cloud.truncated' : 'cloud.nothing', {
            model: result.model
          }), true);
          return;
        }
        state.meal.items = result.items.map(itemFromCloud).concat(
          state.meal.items.filter(function (it) { return !it.food && !it.cloud; })
        );
        state.meal.editing = -1;
        renderMeal();
        save();
        photoNote(t('cloud.done', {
          model: result.model,
          count: result.items.map(function (it) { return it.name; }).join(', ')
        }), false);
      })['catch'](function (err) {
        if (run !== analysisId) { return; }
        rememberExchange(err && err.debug, 0);
        photoNote(cloudFailureText(err), true);
        if (window.console) { console.error('cloud recognition failed', err); }
      })['finally'](function () {
        if (run !== analysisId) { return; }
        cloudBusy = false;
        frame.classList.remove('is-busy');
        renderCloudButton();
      });
    });

    refreshCloudButton = renderCloudButton;

    /* Cloud settings. Everything here goes straight into the stored state,
       which lives in this browser's localStorage and nowhere else. */
    el('cloud-key').addEventListener('change', function () {
      var host = CloudRecognition.settings(state.cloud).host;
      if (!state.cloud.keys) { state.cloud.keys = {}; }
      if (host) { state.cloud.keys[host] = this.value.trim(); }
      delete state.cloud.key;                 // the single-key shape is retired
      save();
      renderCloudButton();
    });

    ['cloud-model', 'cloud-endpoint'].forEach(function (id) {
      el(id).addEventListener('change', function () {
        state.cloud[id === 'cloud-model' ? 'model' : 'endpoint'] = this.value.trim();
        save();
        renderCloudSettings();                // the endpoint decides which key shows
        renderCloudButton();
        renderCloudHelp();
      });
    });

    el('dev-switch').addEventListener('click', function (e) {
      var picked = e.target.closest('[data-dev]');
      if (!picked) { return; }
      state.devMode = picked.getAttribute('data-dev') === 'on';
      save();
      renderProfile();
      renderRawReply();
      renderProbe();
    });

    renderCloudSettings();

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
      renderCloudButton();
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

    /* Body data feeds the maintenance figure, so each field re-renders the
       screens that show it. Out-of-range input is refused, and the field snaps
       back to the stored value rather than silently keeping a bad number. */
    function bodyField(id, key, min, max, decimals) {
      el(id).addEventListener('change', function () {
        var value = parseFloat(String(this.value).replace(',', '.'));
        if (!isNaN(value) && value >= min && value <= max) {
          state[key] = decimals ? Math.round(value * 10) / 10 : Math.round(value);
          save();
          renderHome();
          renderProfile();
          renderActivity();
        }
        this.value = state[key];
      });
    }
    bodyField('p-age', 'age', 14, 100, false);
    bodyField('p-height', 'height', 120, 230, false);
    bodyField('p-weight', 'weight', 30, 300, true);

    el('p-sex').addEventListener('click', function (e) {
      var picked = e.target.closest('[data-sex]');
      if (!picked) { return; }
      state.sex = picked.getAttribute('data-sex');
      save();
      renderHome();
      renderProfile();
    });

    el('p-target').addEventListener('change', function () {
      var value = parseInt(this.value, 10);
      if (!isNaN(value) && value >= 0 && value <= 2000) {
        state.target = value;
        save();
        renderHome();
      }
      renderProfile();
    });

    // Typing over the maintenance figure overrides the calculation; the reset
    // button hands it back to the body data.
    el('p-norm').addEventListener('change', function () {
      var value = parseInt(this.value, 10);
      if (!isNaN(value) && value >= 800 && value <= 6000) {
        state.maintenance = value;
        save();
        renderHome();
      }
      renderProfile();
    });

    el('p-norm-reset').addEventListener('click', function () {
      state.maintenance = null;
      save();
      renderHome();
      renderProfile();
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
      state.editingEntry = -1;
      state.history = seedHistory(45, calculatedMaintenance());
      save();
      renderAll();
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

  /* A model the provider has since retired keeps failing with a 404 that says
     what to use instead; move the saved setting there rather than leaving the
     user to retype it. */
  if (state.cloud && state.cloud.model) {
    var replacement = CloudRecognition.replacementFor(state.cloud.model);
    if (replacement) {
      state.cloud.model = replacement;
      save();
    }
  }

  /* A save from when there was one key field: move it under the host it was
     entered for, so switching provider cannot hand it to the wrong one. */
  if (state.cloud && state.cloud.key) {
    var oldHost = CloudRecognition.hostOf(state.cloud.endpoint ||
      CloudRecognition.defaults().endpoint);
    if (!state.cloud.keys) { state.cloud.keys = {}; }
    if (oldHost && !state.cloud.keys[oldHost]) { state.cloud.keys[oldHost] = state.cloud.key; }
    delete state.cloud.key;
    save();
  }

  /* First run, or a save from before the diary kept days: give the app a today
     and a demo history so nothing renders against empty state. */
  if (!state.history) { state.history = seedHistory(45, calculatedMaintenance()); }
  if (!state.today) { state.today = todayKey(); }
  rollOverDay();

  // ?seed=meal fills the meal with a recognition result. Used by tools/make-screenshots.sh
  // and handy for demos; it never runs on its own.
  if (new URLSearchParams(location.search).get('seed') === 'meal') {
    var seeded = ['cheeseburger', 'corn'].map(function (id) {
      return itemFromFood(FoodRecognition.byId(id));
    });
    state.meal = { type: 'lunch', items: seeded, editing: 0 };
  }

  wire();
  setupSwipeGestures();
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
