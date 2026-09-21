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
      'home.fatEquivalent': 'Жировой эквивалент ≈ {sign}{g} г',
      'home.fatFromStores': 'использовано из запасов',
      'home.fatToStores': 'отложено в запас',
      'home.days7': '7 дней', 'home.days30': '30 дней',
      'home.feed': 'ЛЕНТА ДНЯ', 'home.all': 'Всё', 'home.snapFood': 'Снять еду',
      'home.targetNote': 'чтобы выйти на дневной дефицит {target} ккал',
      'home.targetDone': 'сверх цели ещё {extra} ккал',
      'home.empty': 'Сегодня пока ничего не записано — новый день начинается пустым.',
      'home.emptyHistory': 'Прошлые дни →',

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
      'cloud.explain': 'Зачем это нужно. Модель на телефоне знает около 40 категорий и домашнюю еду не распознаёт — борщ, плов или салат она назвать не может. Облачная модель узнаёт конкретные блюда, разбирает тарелку на составляющие и оценивает вес порций — качество распознавания несоизмеримо выше.',
      'cloud.explainCost': 'Цена — приватность: с ключом на экране фото появляется кнопка «Уточнить в облаке», и она отправляет один снимок выбранной модели. Без ключа всё остаётся на телефоне, как и было.',
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
      'dev.hint': 'Показывает окно отладки над нижней панелью: жесты, облачные вызовы и полные ответы моделей.',
      'dev.panel': 'Отладка', 'dev.clear': 'Очистить', 'dev.empty': 'пока пусто',
      'cloud.refine': 'Уточнить в облаке', 'cloud.sending': 'Отправляю снимок…',
      'cloud.willSend': 'Снимок уйдёт в {model}. Это единственный случай, когда фото покидает телефон.',
      'cloud.needKey': 'Чтобы включить, впишите API-ключ в профиле.',
      'cloud.done': '{model}: {count} — проверьте вес и калории.',
      'cloud.nothing': '{model} не нашла еду на снимке.',
      'cloud.truncated': 'Ответ {model} оборвался на полпути — не хватило лимита. Попробуйте ещё раз.',
      'cloud.allThinking': '{model} потратила весь лимит на размышления и не ответила ни словом. Попробуйте ещё раз или смените модель в профиле.',
      'cloud.blind': '{model} не получила снимок — судя по счётчику токенов, ушёл только текст. Нужна модель, которая умеет смотреть фото; смените её в профиле.',
      'cloud.failed': 'Облако не ответило: {message}',
      'cloud.badKey': 'Ключ не принят ({status}). Проверьте его в профиле.',
      'cloud.blocked': 'Не удалось связаться с {host}: нет сети, либо сервис не принимает запросы прямо со страницы (CORS) — тогда нужен прокси.',
      'cloud.timeout': 'Облако не ответило за 45 секунд.',
      'photo.mealType': 'Приём пищи', 'photo.items': 'Состав · можно поправить',
      'photo.emptyItems': 'Снимите фото или добавьте продукт вручную.',
      'photo.total': 'Итого', 'photo.totalWeight': '{g} г всего',
      'photo.addProduct': 'Добавить продукт', 'photo.save': 'Записать в дневник',
      'photo.saveNeedsKcal': 'Впишите калории продукта',
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
      'act.walking': 'Ходьба', 'act.walkingBrisk': 'Быстрая ходьба', 'act.nordic': 'Скандинавская ходьба',
      'act.hiking': 'Поход', 'act.stairs': 'Лестница', 'act.dogWalking': 'Выгул собаки',
      'act.running': 'Бег', 'act.runningSlow': 'Лёгкий бег', 'act.runningFast': 'Быстрый бег',
      'act.treadmill': 'Беговая дорожка',
      'act.cycling': 'Велосипед', 'act.cyclingSlow': 'Велосипед спокойно',
      'act.cyclingFast': 'Велосипед быстро', 'act.spinning': 'Сайкл',
      'act.gym': 'Зал', 'act.strength': 'Силовая', 'act.crossfit': 'Кроссфит',
      'act.calisthenics': 'Турник и брусья',
      'act.swimming': 'Плавание', 'act.swimmingSlow': 'Плавание спокойно',
      'act.waterAerobics': 'Аквааэробика', 'act.rowing': 'Гребля',
      'act.yoga': 'Йога', 'act.pilates': 'Пилатес', 'act.stretching': 'Растяжка',
      'act.dancing': 'Танцы', 'act.aerobics': 'Аэробика',
      'act.football': 'Футбол', 'act.basketball': 'Баскетбол', 'act.volleyball': 'Волейбол',
      'act.tennis': 'Теннис', 'act.tableTennis': 'Настольный теннис', 'act.badminton': 'Бадминтон',
      'act.boxing': 'Бокс', 'act.martialArts': 'Единоборства', 'act.climbing': 'Скалолазание',
      'act.skating': 'Коньки', 'act.skiing': 'Лыжи', 'act.snowboard': 'Сноуборд',
      'act.sledding': 'Санки', 'act.horseRiding': 'Верховая езда', 'act.golf': 'Гольф',
      'act.chores': 'Дом. дела', 'act.cleaning': 'Уборка', 'act.cooking': 'Готовка',
      'act.shopping': 'Покупки', 'act.gardening': 'Сад и огород', 'act.childcare': 'С детьми',
      'act.repairs': 'Ремонт', 'act.snowShovelling': 'Уборка снега', 'act.moving': 'Переноска вещей',
      'actGroup.walk': 'Ходьба и прогулки', 'actGroup.run': 'Бег',
      'actGroup.wheels': 'Велосипед', 'actGroup.strength': 'Силовые',
      'actGroup.water': 'Вода', 'actGroup.studio': 'Студия и растяжка',
      'actGroup.sport': 'Игры и единоборства', 'actGroup.outdoor': 'На улице',
      'actGroup.home': 'Дом и быт',
      'act.pick': 'Виды активности', 'act.pickHint': 'Отмеченные появляются на экране активности. Сейчас выбрано: {count}.',
      'act.pickOpen': 'Выбрать виды активности', 'act.pickDone': 'Готово',
      'act.light': 'Лёгкая', 'act.moderate': 'Средняя', 'act.high': 'Высокая',

      'meal.breakfast': 'Завтрак', 'meal.lunch': 'Обед', 'meal.dinner': 'Ужин', 'meal.snack': 'Перекус',

      'stats.eyebrow': 'FitBalance · статистика', 'stats.accumulated': 'накопленный дефицит в жировом эквиваленте',
      'stats.perDay': 'Дефицит по дням · цель {target}', 'stats.toNextKg': 'До эквивалента {kg} кг',
      'stats.remaining': 'ещё {kcal} ккал', 'stats.last30': 'Последние 30 дней',
      'stats.surplus': 'профицит', 'stats.deficit': 'дефицит',
      'stats.week': 'Неделя', 'stats.month': 'Месяц', 'stats.year': 'Год',
      'stats.accumulatedSurplus': 'профицит за период в жировом эквиваленте',
      'hist.eyebrow': 'FitBalance · дни', 'hist.title': 'ИСТОРИЯ',
      'hist.today': 'Сегодня', 'hist.empty': 'Пока ни одного записанного дня',

      'prof.firstName': 'Имя', 'prof.lastName': 'Фамилия',
      'prof.avatar': 'Фото или иконка', 'prof.avatarPhoto': 'Загрузить фото',
      'prof.avatarClear': 'Убрать',
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
      'months': ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      'monthsFull': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    },
    en: {
      'nav.today': 'Today', 'nav.history': 'History', 'nav.stats': 'Stats', 'nav.profile': 'Profile',
      'unit.kcal': 'kcal', 'unit.g': 'g', 'unit.kg': 'kg', 'unit.min': 'min',
      'a11y.back': 'Back', 'a11y.less': 'Less', 'a11y.more': 'More',

      'home.leftToBurn': 'Left to burn', 'home.targetMet': "Today's target is met",
      'home.eaten': 'Eaten', 'home.burned': 'Burned', 'home.maintenance': 'Maintenance',
      'home.deficitNow': 'Deficit now', 'home.surplusNow': 'Surplus now',
      'home.fatEquivalent': 'Fat equivalent ≈ {sign}{g} g',
      'home.fatFromStores': 'drawn from stores',
      'home.fatToStores': 'put into stores',
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
      'cloud.explain': 'What it buys you. The on-device model knows about forty categories and cannot name home cooking — a stew, a pilaf or a salad is beyond it. A cloud model names the actual dishes, breaks a plate into its parts and estimates the portions: incomparably better recognition.',
      'cloud.explainCost': 'The price is privacy: with a key, the photo screen gets an "Ask the cloud" button that sends one picture to the model you choose. Without a key everything stays on the phone, as before.',
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
      'dev.hint': 'Shows a debug window above the tab bar: gestures, cloud calls and the models\u2019 full replies.',
      'dev.panel': 'Debug', 'dev.clear': 'Clear', 'dev.empty': 'nothing yet',
      'cloud.refine': 'Ask the cloud', 'cloud.sending': 'Sending the picture…',
      'cloud.willSend': 'The picture goes to {model}. This is the only time a photo leaves the phone.',
      'cloud.needKey': 'Add an API key in the profile to enable this.',
      'cloud.done': '{model}: {count} — check the weights and calories.',
      'cloud.nothing': '{model} found no food in the picture.',
      'cloud.truncated': 'The reply from {model} was cut off mid-sentence — it ran out of budget. Try again.',
      'cloud.allThinking': '{model} spent the whole budget thinking and never wrote a word. Try again, or change the model in the profile.',
      'cloud.blind': '{model} never received the picture — by the token count only the text went. This needs a model that can see photos; change it in the profile.',
      'cloud.failed': 'The cloud did not answer: {message}',
      'cloud.badKey': 'The key was refused ({status}). Check it in the profile.',
      'cloud.blocked': 'Could not reach {host}: either there is no network, or the service refuses calls straight from a page (CORS), which needs a proxy.',
      'cloud.timeout': 'The cloud did not answer within 45 seconds.',
      'photo.mealType': 'Meal', 'photo.items': 'Contents · editable',
      'photo.emptyItems': 'Take a photo, or add an item by hand.',
      'photo.total': 'Total', 'photo.totalWeight': '{g} g in total',
      'photo.addProduct': 'Add an item', 'photo.save': 'Save to diary',
      'photo.saveNeedsKcal': 'Enter the item\u2019s calories',
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
      'act.walking': 'Walking', 'act.walkingBrisk': 'Brisk walking', 'act.nordic': 'Nordic walking',
      'act.hiking': 'Hiking', 'act.stairs': 'Stairs', 'act.dogWalking': 'Walking the dog',
      'act.running': 'Running', 'act.runningSlow': 'Easy run', 'act.runningFast': 'Fast run',
      'act.treadmill': 'Treadmill',
      'act.cycling': 'Cycling', 'act.cyclingSlow': 'Easy cycling',
      'act.cyclingFast': 'Fast cycling', 'act.spinning': 'Spinning',
      'act.gym': 'Gym', 'act.strength': 'Strength', 'act.crossfit': 'CrossFit',
      'act.calisthenics': 'Calisthenics',
      'act.swimming': 'Swimming', 'act.swimmingSlow': 'Easy swimming',
      'act.waterAerobics': 'Water aerobics', 'act.rowing': 'Rowing',
      'act.yoga': 'Yoga', 'act.pilates': 'Pilates', 'act.stretching': 'Stretching',
      'act.dancing': 'Dancing', 'act.aerobics': 'Aerobics',
      'act.football': 'Football', 'act.basketball': 'Basketball', 'act.volleyball': 'Volleyball',
      'act.tennis': 'Tennis', 'act.tableTennis': 'Table tennis', 'act.badminton': 'Badminton',
      'act.boxing': 'Boxing', 'act.martialArts': 'Martial arts', 'act.climbing': 'Climbing',
      'act.skating': 'Skating', 'act.skiing': 'Skiing', 'act.snowboard': 'Snowboarding',
      'act.sledding': 'Sledding', 'act.horseRiding': 'Horse riding', 'act.golf': 'Golf',
      'act.chores': 'Housework', 'act.cleaning': 'Cleaning', 'act.cooking': 'Cooking',
      'act.shopping': 'Shopping', 'act.gardening': 'Gardening', 'act.childcare': 'With the kids',
      'act.repairs': 'Repairs', 'act.snowShovelling': 'Shovelling snow', 'act.moving': 'Carrying things',
      'actGroup.walk': 'Walking', 'actGroup.run': 'Running',
      'actGroup.wheels': 'Cycling', 'actGroup.strength': 'Strength',
      'actGroup.water': 'Water', 'actGroup.studio': 'Studio and stretching',
      'actGroup.sport': 'Games and combat', 'actGroup.outdoor': 'Outdoors',
      'actGroup.home': 'Home and errands',
      'act.pick': 'Activity types', 'act.pickHint': 'The ones you tick appear on the activity screen. Chosen: {count}.',
      'act.pickOpen': 'Choose activity types', 'act.pickDone': 'Done',
      'act.light': 'Light', 'act.moderate': 'Moderate', 'act.high': 'High',

      'meal.breakfast': 'Breakfast', 'meal.lunch': 'Lunch', 'meal.dinner': 'Dinner', 'meal.snack': 'Snack',

      'stats.eyebrow': 'FitBalance · statistics', 'stats.accumulated': 'accumulated deficit as fat equivalent',
      'stats.perDay': 'Deficit per day · target {target}', 'stats.toNextKg': 'To {kg} kg equivalent',
      'stats.remaining': '{kcal} kcal to go', 'stats.last30': 'Last 30 days',
      'stats.surplus': 'surplus', 'stats.deficit': 'deficit',
      'stats.week': 'Week', 'stats.month': 'Month', 'stats.year': 'Year',
      'stats.accumulatedSurplus': 'surplus over the period in fat equivalent',
      'hist.eyebrow': 'FitBalance · days', 'hist.title': 'HISTORY',
      'hist.today': 'Today', 'hist.empty': 'No day recorded yet',

      'prof.firstName': 'First name', 'prof.lastName': 'Last name',
      'prof.avatar': 'Photo or icon', 'prof.avatarPhoto': 'Upload a photo',
      'prof.avatarClear': 'Remove',
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
      'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      'monthsFull': ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    }
  };

  /* ---------------- domain ---------------- */

  /* A catalogue rather than a handful: MET values from the Compendium of
     Physical Activities, rounded to the precision this app can honestly claim.
     The user picks which of these they actually do; the rest stay out of the
     way in a "more" list. */
  var MET = {
    walking: 3.5, walkingBrisk: 4.3, hiking: 6.0, nordic: 4.8, stairs: 8.0,
    running: 9.8, runningSlow: 7.0, runningFast: 11.5, treadmill: 8.5,
    cycling: 7.5, cyclingSlow: 4.0, cyclingFast: 10.0, spinning: 8.5,
    gym: 5.0, strength: 6.0, crossfit: 8.0, calisthenics: 5.5,
    swimming: 7.0, swimmingSlow: 5.3, waterAerobics: 4.5, rowing: 7.0,
    yoga: 3.0, pilates: 3.5, stretching: 2.3, dancing: 5.5, aerobics: 7.3,
    football: 7.0, basketball: 6.5, volleyball: 4.0, tennis: 7.3, tableTennis: 4.0,
    badminton: 5.5, boxing: 9.0, martialArts: 10.3, climbing: 8.0, skating: 7.0,
    skiing: 7.0, snowboard: 5.3, sledding: 5.0, horseRiding: 5.5, golf: 4.8,
    chores: 3.3, cleaning: 3.5, cooking: 2.5, shopping: 2.3, gardening: 4.0,
    childcare: 3.0, dogWalking: 3.0, repairs: 4.5, snowShovelling: 6.0, moving: 5.8
  };
  var INTENSITY = { light: 0.8, moderate: 1.0, high: 1.3 };

  /* What the activity screen offers by default. Everything else lives in the
     catalogue and is added from the profile. */
  var DEFAULT_ACTIVITIES = ['walking', 'running', 'gym', 'cycling', 'swimming', 'chores'];

  /* Grouped for the picker, in the order they are offered. */
  var ACTIVITY_GROUPS = [
    { id: 'walk', items: ['walking', 'walkingBrisk', 'nordic', 'hiking', 'stairs', 'dogWalking'] },
    { id: 'run', items: ['running', 'runningSlow', 'runningFast', 'treadmill'] },
    { id: 'wheels', items: ['cycling', 'cyclingSlow', 'cyclingFast', 'spinning'] },
    { id: 'strength', items: ['gym', 'strength', 'crossfit', 'calisthenics'] },
    { id: 'water', items: ['swimming', 'swimmingSlow', 'waterAerobics', 'rowing'] },
    { id: 'studio', items: ['yoga', 'pilates', 'stretching', 'dancing', 'aerobics'] },
    { id: 'sport', items: ['football', 'basketball', 'volleyball', 'tennis', 'tableTennis',
      'badminton', 'boxing', 'martialArts', 'climbing'] },
    { id: 'outdoor', items: ['skating', 'skiing', 'snowboard', 'sledding', 'horseRiding', 'golf'] },
    { id: 'home', items: ['chores', 'cleaning', 'cooking', 'shopping', 'gardening',
      'childcare', 'repairs', 'snowShovelling', 'moving'] }
  ];

  function activityTypes() {
    var chosen = state.activities && state.activities.length
      ? state.activities
      : DEFAULT_ACTIVITIES;
    return chosen.filter(function (key) { return MET[key]; });
  }
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
    person: { first: '', last: '', icon: '', photo: null },
    sex: 'male',
    age: 34,
    height: 182,
    weight: 84.5,
    maintenance: null,          // null = derived from the body data below
    target: 700,
    statsPeriod: 'week',
    statsAnchor: null,
    today: null,                // the date `entries` belong to
    entries: seedEntries(),
    editingEntry: -1,
    history: null,              // date -> closed day; filled with demo days on first run
    activities: DEFAULT_ACTIVITIES.slice(),
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
    /* The same balance in the unit people think in. A deficit is fat drawn on,
       a surplus is fat put away - stated as such, with the sign that belongs to
       the direction. */
    el('deficit-grams').textContent = t('home.fatEquivalent', {
      sign: s.deficit >= 0 ? '−' : '+',
      g: num(s.grams)
    });
    el('deficit-fat-note').textContent =
      t(s.deficit >= 0 ? 'home.fatFromStores' : 'home.fatToStores');

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
      /* A day that rolled over at midnight starts empty, which reads as lost
         data unless the screen says where the previous one went. */
      var empty = document.createElement('div');
      empty.className = 'feed__empty';
      empty.textContent = t('home.empty') + ' ';
      var link = button(t('home.emptyHistory'), false, function () { go('history'); }, 'link');
      empty.appendChild(link);
      feed.appendChild(empty);
      return;
    }
    /* In clock order, earliest first: the day as it happened, which is also the
       order a drag rearranges. */
    byTime(state.entries).forEach(function (e) {
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
        if (dragMoved) { return; }            // the press that ended a drag is not a tap
        state.editingEntry = state.editingEntry === index ? -1 : index;
        renderHome();
      });
      wrap.setAttribute('data-entry', index);
      startDragWatch(wrap, row, index);
      wrap.appendChild(row);

      if (state.editingEntry === index) { wrap.appendChild(buildEntryEditor(e, index)); }
      feed.appendChild(wrap);
    });
  }

  /* Press and hold a diary row to move it. A long press rather than an
     immediate drag, because the same finger scrolls the screen and swipes
     between tabs; 350 ms is long enough to tell them apart and short enough not
     to feel stuck. */
  var HOLD_MS = 350;
  var dragMoved = false;

  function startDragWatch(wrap, row, index) {
    var holdTimer = null;
    var startY = 0, startX = 0;
    var dragging = false;
    var rowHeight = 0;
    var offset = 0;
    var siblings = [];
    var fromPosition = 0;

    function positions() {
      var list = [];
      Array.prototype.forEach.call(el('feed').children, function (node) {
        list.push(node);
      });
      return list;
    }

    function begin() {
      dragging = true;
      dragMoved = false;
      siblings = positions();
      fromPosition = siblings.indexOf(wrap);
      rowHeight = wrap.getBoundingClientRect().height || 44;
      wrap.classList.add('is-moving');
      el('feed').classList.add('is-sorting');
      if (navigator.vibrate) { navigator.vibrate(10); }
    }

    function targetPosition() {
      var moved = Math.round(offset / rowHeight);
      return Math.max(0, Math.min(siblings.length - 1, fromPosition + moved));
    }

    function paint() {
      wrap.style.transform = 'translateY(' + offset + 'px)';
      var target = targetPosition();
      siblings.forEach(function (node, i) {
        if (node === wrap) { return; }
        var shift = 0;
        if (fromPosition < target && i > fromPosition && i <= target) { shift = -rowHeight; }
        if (fromPosition > target && i >= target && i < fromPosition) { shift = rowHeight; }
        node.style.transform = shift ? 'translateY(' + shift + 'px)' : '';
      });
    }

    function finish(apply) {
      clearTimeout(holdTimer);
      var target = targetPosition();
      siblings.forEach(function (node) { node.style.transform = ''; });
      wrap.classList.remove('is-moving');
      el('feed').classList.remove('is-sorting');
      if (apply && dragging && target !== fromPosition) {
        var ordered = byTime(state.entries);
        var entry = ordered[fromPosition];
        entry.time = timeForPosition(ordered, fromPosition, target);
        state.editingEntry = -1;
        save();
        renderHome();
      }
      dragging = false;
      offset = 0;
    }

    row.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { return; }
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      dragMoved = false;
      holdTimer = setTimeout(begin, HOLD_MS);
    }, { passive: true });

    row.addEventListener('touchmove', function (e) {
      var touch = e.touches[0];
      if (!dragging) {
        // Moving before the hold completes means a scroll or a tab swipe.
        if (Math.abs(touch.clientY - startY) > 8 || Math.abs(touch.clientX - startX) > 8) {
          clearTimeout(holdTimer);
        }
        return;
      }
      e.preventDefault();                      // the row moves, the screen does not
      e.stopPropagation();
      dragMoved = true;
      offset = touch.clientY - startY;
      paint();
    }, { passive: false });

    row.addEventListener('touchend', function () { finish(true); });
    row.addEventListener('touchcancel', function () { finish(false); });

    /* The same thing with a mouse, so the prototype can be rearranged on a
       desktop as well. */
    row.addEventListener('mousedown', function (e) {
      startY = e.clientY;
      startX = e.clientX;
      dragMoved = false;
      holdTimer = setTimeout(begin, HOLD_MS);

      function onMove(move) {
        if (!dragging) {
          if (Math.abs(move.clientY - startY) > 8) { clearTimeout(holdTimer); }
          return;
        }
        dragMoved = true;
        offset = move.clientY - startY;
        paint();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        finish(true);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function byTime(entries) {
    return entries.slice().sort(function (a, b) {
      return a.time === b.time ? 0 : (a.time < b.time ? -1 : 1);
    });
  }

  function minutesOf(time) {
    var parts = String(time || '00:00').split(':');
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }

  function timeOf(minutes) {
    var clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(minutes)));
    return String(Math.floor(clamped / 60)).padStart(2, '0') + ':' +
      String(clamped % 60).padStart(2, '0');
  }

  /* Dropping an entry between two others gives it a time between theirs, which
     is what keeps "drag to reorder" and "sorted by the clock" from being two
     different orders. At the ends there is nothing to split, so it steps half
     an hour past the neighbour it landed beside. */
  function timeForPosition(ordered, movedIndex, targetIndex) {
    var without = ordered.slice();
    without.splice(movedIndex, 1);
    var before = without[targetIndex - 1];
    var after = without[targetIndex];
    if (!before && !after) { return ordered[movedIndex].time; }
    if (!before) { return timeOf(minutesOf(after.time) - 30); }
    if (!after) { return timeOf(minutesOf(before.time) + 30); }
    var gap = minutesOf(after.time) - minutesOf(before.time);
    return timeOf(minutesOf(before.time) + (gap > 1 ? Math.round(gap / 2) : 1));
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
      : activityTypes().map(function (k) { return 'act.' + k; });
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
    /* A meal with no calories cannot be written to the diary, and a disabled
       button that says nothing reads as broken. */
    el('save-meal').disabled = m.kcal === 0;
    el('save-meal').style.opacity = m.kcal === 0 ? '0.45' : '1';
    el('save-meal').textContent = t(m.kcal === 0 ? 'photo.saveNeedsKcal' : 'photo.save');
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
    activityTypes().forEach(function (key) {
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

  /* ---------------- statistics periods ---------------- */

  /* Periods are calendar periods, not the last N days: a week runs Monday to
     Sunday, a month is the month, a year is January to December. `statsAnchor`
     is any date inside the period on show, which is what the arrows move. */
  function startOfWeek(date) {
    var monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
  }

  function periodRange(period, anchor) {
    if (period === 'week') {
      var from = startOfWeek(anchor);
      return { from: from, to: new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6) };
    }
    if (period === 'month') {
      return {
        from: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
        to: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)
      };
    }
    return {
      from: new Date(anchor.getFullYear(), 0, 1),
      to: new Date(anchor.getFullYear(), 11, 31)
    };
  }

  function shiftAnchor(period, anchor, step) {
    if (period === 'week') {
      return new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + step * 7);
    }
    if (period === 'month') {
      return new Date(anchor.getFullYear(), anchor.getMonth() + step, 1);
    }
    return new Date(anchor.getFullYear() + step, 0, 1);
  }

  function statsAnchorDate() {
    return state.statsAnchor ? parseKey(state.statsAnchor) : new Date();
  }

  function periodLabel(period, anchor) {
    var months = COPY[state.lang].months;
    if (period === 'year') { return String(anchor.getFullYear()); }
    if (period === 'month') {
      // Spelled out here, abbreviated on the arrows and the chart.
      return COPY[state.lang].monthsFull[anchor.getMonth()] + ' ' + anchor.getFullYear();
    }
    var range = periodRange('week', anchor);
    var sameMonth = range.from.getMonth() === range.to.getMonth();
    return range.from.getDate() + (sameMonth ? '' : ' ' + months[range.from.getMonth()]) +
      '–' + range.to.getDate() + ' ' + months[range.to.getMonth()] + ' ' + range.to.getFullYear();
  }

  /* The label on the arrow: the period it would move to. */
  function neighbourLabel(period, anchor, step) {
    var moved = shiftAnchor(period, anchor, step);
    if (period === 'year') { return String(moved.getFullYear()); }
    if (period === 'month') { return COPY[state.lang].months[moved.getMonth()]; }
    var range = periodRange('week', moved);
    return range.from.getDate() + '–' + range.to.getDate();
  }

  function daysBetween(from, to) {
    var out = [];
    var cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    while (cursor <= to) {
      var key = dateKey(cursor);
      out.push(dayStats(key) || {
        key: key, eaten: 0, burned: 0, maintenance: maintenance(), empty: true
      });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    return out;
  }

  /* Every column of the chart, plus the total behind it. Week and month are one
     column per day; a year is twelve months, January first. */
  function statsColumns(period, anchor) {
    var range = periodRange(period, anchor);
    var today = dateKey(new Date());

    if (period !== 'year') {
      var days = daysBetween(range.from, range.to);
      return days.map(function (day, i) {
        var date = parseKey(day.key);
        var dense = days.length > 14;
        return {
          value: day.empty ? 0 : dayDeficit(day),
          // A month has too many columns to label every one of them.
          label: period === 'week'
            ? COPY[state.lang].weekdays[(date.getDay() + 6) % 7]
            : (i === 0 || (date.getDate() % 5 === 0) ? String(date.getDate()) : ''),
          isNow: day.key === today,
          dense: dense
        };
      });
    }

    var buckets = [];
    for (var month = 0; month < 12; month += 1) {
      buckets.push({ month: month, total: 0 });
    }
    daysBetween(range.from, range.to).forEach(function (day) {
      if (day.empty) { return; }
      buckets[parseKey(day.key).getMonth()].total += dayDeficit(day);
    });
    var now = new Date();
    return buckets.map(function (bucket) {
      return {
        value: bucket.total,
        label: COPY[state.lang].months[bucket.month],
        isNow: anchor.getFullYear() === now.getFullYear() && bucket.month === now.getMonth(),
        dense: false
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
          state.statsAnchor = dateKey(new Date());   // a new period starts at today
          save();
          renderStats();
        }));
      });
    }
    periods.forEach(function (key, i) {
      seg.children[i].textContent = t('stats.' + key);
      seg.children[i].setAttribute('aria-pressed', state.statsPeriod === key ? 'true' : 'false');
    });

    var anchor = statsAnchorDate();
    var period = state.statsPeriod;
    var range = periodRange(period, anchor);
    var columns = statsColumns(period, anchor);
    var total = daysBetween(range.from, range.to).reduce(function (sum, day) {
      return sum + (day.empty ? 0 : dayDeficit(day));
    }, 0);

    /* Stepping forward past the current period would show an empty future. */
    var ahead = periodRange(period, shiftAnchor(period, anchor, 1)).from > new Date();
    el('period-label').textContent = periodLabel(period, anchor);
    el('period-prev').textContent = '‹ ' + neighbourLabel(period, anchor, -1);
    el('period-next').textContent = neighbourLabel(period, anchor, 1) + ' ›';
    el('period-next').disabled = ahead;
    el('period-next').style.opacity = ahead ? '0.35' : '1';

    /* The headline is the period on show, not all of recorded time, and it
       carries both units: the calories and what they are worth in fat. */
    var sign = total === 0 ? '' : (total > 0 ? '−' : '+');
    el('stats-title').innerHTML = '≈ ' + sign +
      num(Math.round(Math.abs(total) / KCAL_PER_KG * 100) / 100) +
      ' <span>' + t('unit.kg') + '</span>';
    el('stats-sub').textContent = t(total >= 0 ? 'stats.accumulated' : 'stats.accumulatedSurplus');
    el('stats-total-kcal').textContent = sign + num(Math.abs(total)) + ' ' + t('unit.kcal');

    el('stats-period-label').textContent = t('stats.perDay', { target: num(state.target) });
    el('stats-period-total').innerHTML = sign +
      num(gramsOf(total)) + ' <span>' + t('unit.g') + '</span>';

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

      if (column.value < 0) {                 // a surplus sits above the axis
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

    var kg = total / KCAL_PER_KG;
    var milestone = (Math.floor(Math.abs(kg) / 0.5) + 1) * 0.5;
    var remaining = Math.round(milestone * KCAL_PER_KG - Math.abs(total));
    el('stats-milestone').textContent = t('stats.toNextKg', {
      kg: num(kg >= 0 ? milestone : -milestone)
    });
    el('stats-remaining').textContent = t('stats.remaining', { kcal: num(remaining) });
    el('goal-fill').style.width =
      Math.max(2, Math.min(100, Math.round((1 - remaining / (0.5 * KCAL_PER_KG)) * 100))) + '%';

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

  /* The catalogue, grouped. Ticking a type adds it to the activity screen;
     the last one cannot be removed, since the screen needs something to offer. */
  function renderActivityPicker() {
    var box = el('act-picker');
    var chosen = activityTypes();
    el('act-pick-hint').textContent = t('act.pickHint', { count: chosen.length });

    if (box.children.length) {
      Array.prototype.forEach.call(box.querySelectorAll('.act-pill'), function (pill) {
        var on = chosen.indexOf(pill.getAttribute('data-act')) !== -1;
        pill.textContent = t('act.' + pill.getAttribute('data-act'));
        pill.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      Array.prototype.forEach.call(box.querySelectorAll('.act-group__k'), function (head) {
        head.textContent = t('actGroup.' + head.getAttribute('data-group'));
      });
      return;
    }

    ACTIVITY_GROUPS.forEach(function (group) {
      var section = document.createElement('div');
      section.className = 'act-group';
      var head = document.createElement('div');
      head.className = 'act-group__k';
      head.setAttribute('data-group', group.id);
      head.textContent = t('actGroup.' + group.id);
      section.appendChild(head);

      var items = document.createElement('div');
      items.className = 'act-group__items';
      group.items.forEach(function (key) {
        var pill = button(t('act.' + key), chosen.indexOf(key) !== -1, function () {
          toggleActivity(key);
        }, 'act-pill');
        pill.setAttribute('data-act', key);
        items.appendChild(pill);
      });
      section.appendChild(items);
      box.appendChild(section);
    });
  }

  function toggleActivity(key) {
    var chosen = activityTypes().slice();
    var at = chosen.indexOf(key);
    if (at === -1) {
      chosen.push(key);
    } else {
      if (chosen.length === 1) { return; }        // the screen needs one to offer
      chosen.splice(at, 1);
    }
    state.activities = chosen;
    // A draft pointing at a type that is gone would render nothing.
    if (chosen.indexOf(state.draft.type) === -1) { state.draft.type = chosen[0]; }
    save();
    renderActivityPicker();
    renderActivity();
  }

  var AVATAR_ICONS = ['🏃', '🚴', '🏋️', '🧘', '⚽', '🥗', '🍎', '🐱'];
  var AVATAR_SIZE = 160;        // px, square: enough for a 66px circle on any screen

  function initials(person) {
    var letters = (person.first || '').trim().charAt(0) + (person.last || '').trim().charAt(0);
    return letters.toUpperCase();
  }

  /* The face in two places: the profile and the home screen corner. A photo
     wins over an icon, an icon over initials, initials over the default mark. */
  function renderPerson() {
    var person = state.person || {};
    var avatar = el('person-avatar');
    var corner = el('home-avatar');

    el('p-first').value = person.first || '';
    el('p-last').value = person.last || '';

    avatar.classList.toggle('has-photo', !!person.photo);
    avatar.style.backgroundImage = person.photo ? 'url(' + person.photo + ')' : '';
    avatar.textContent = person.photo ? '' : (person.icon || initials(person) || '—');

    corner.classList.toggle('has-avatar', !!(person.photo || person.icon));
    corner.style.backgroundImage = person.photo ? 'url(' + person.photo + ')' : '';
    var emoji = corner.querySelector('.avatar-emoji');
    if (!person.photo && person.icon) {
      if (!emoji) {
        emoji = document.createElement('span');
        emoji.className = 'avatar-emoji';
        corner.appendChild(emoji);
      }
      emoji.textContent = person.icon;
    } else if (emoji) {
      emoji.remove();
    }

    var icons = el('avatar-icons');
    if (!icons.children.length) {
      AVATAR_ICONS.forEach(function (glyph) {
        icons.appendChild(button(glyph, false, function () {
          state.person.icon = state.person.icon === glyph ? '' : glyph;
          state.person.photo = null;          // an icon replaces a photo
          save();
          renderPerson();
        }, 'avatar-icon'));
      });
    }
    Array.prototype.forEach.call(icons.children, function (node) {
      node.setAttribute('aria-pressed', node.textContent === person.icon ? 'true' : 'false');
    });
  }

  /* A phone photo is megabytes; a 160px square is a few kilobytes, which is what
     belongs in localStorage next to the diary. */
  function storeAvatarPhoto(file) {
    var url = URL.createObjectURL(file);
    var image = new Image();
    image.onload = function () {
      var side = Math.min(image.naturalWidth, image.naturalHeight);
      var canvas = document.createElement('canvas');
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;
      canvas.getContext('2d').drawImage(
        image,
        (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side,
        0, 0, AVATAR_SIZE, AVATAR_SIZE
      );
      state.person.photo = canvas.toDataURL('image/jpeg', 0.8);
      state.person.icon = '';
      URL.revokeObjectURL(url);
      save();
      renderPerson();
    };
    image.onerror = function () { URL.revokeObjectURL(url); };
    image.src = url;
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
    renderActivityPicker();
    renderPerson();
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

  /* Everything about one cloud call, written to the log the moment it lands -
     the reply in full, because the parser drops whatever it cannot use and the
     difference only shows here. */
  function rememberExchange(debug, parsedCount) {
    if (!debug) { return; }
    var line = 'cloud ' + debug.model +
      ' · ' + (debug.status === null ? 'no reply' : debug.status) +
      ' · ' + (debug.ms === null ? '?' : debug.ms) + 'ms' +
      ' · img ' + debug.imageKb + 'kb';
    if (debug.usage) {
      line += ' · tokens ' + (debug.usage.prompt_tokens || 0) + '+' +
        (debug.usage.completion_tokens || 0) + '=' + (debug.usage.total_tokens || 0);
    }
    if (debug.reasoning) { line += ' (+' + debug.reasoning + ' hidden)'; }
    if (debug.finish) { line += ' · finish=' + debug.finish; }
    line += ' · items ' + parsedCount;
    if (debug.salvaged) { line += ' (salvaged)'; }
    if (debug.imageLikelyIgnored) {
      line += '\n  ! prompt is ' + debug.promptTokens +
        ' tokens for a ' + debug.imageKb + 'kb image: the model likely ignored the picture';
    }
    if (debug.emptyContent) { line += '\n  ! content is empty'; }
    if (debug.error) { line += '\n  error: ' + debug.error; }
    if (debug.raw) { line += '\n  reply: ' + debug.raw; }
    if (debug.reasoningText) { line += '\n  reasoning: ' + debug.reasoningText; }
    debugLog(line);
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
    renderDebug();
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

  /* Developer mode keeps one window: the gesture read-out in its bar, and a log
     underneath carrying everything worth seeing after the fact - gestures that
     were refused, cloud calls, and the models' replies in full. */
  var LOG_LIMIT = 300;
  var debugLines = [];

  var probe = {
    starts: 0, moves: 0, ends: 0, cancels: 0,
    mode: '-', stop: '-', dx: 0, dy: 0, screen: '-', touchAction: '-', width: 0
  };

  function frameWidth() {
    var frame = document.querySelector('.app');
    return frame ? frame.getBoundingClientRect().width : 0;
  }

  function stamp() {
    var now = new Date();
    return String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
  }

  function debugLog(text) {
    debugLines.push(stamp() + ' ' + text);
    if (debugLines.length > LOG_LIMIT) { debugLines.shift(); }
    renderDebug();
  }

  function renderDebug() {
    var panel = el('debug-panel');
    if (!panel) { return; }
    if (!state.devMode) { panel.hidden = true; return; }
    panel.hidden = false;
    panel.classList.toggle('is-open', !!state.devOpen);
    el('debug-toggle').setAttribute('aria-expanded', state.devOpen ? 'true' : 'false');

    el('debug-status').textContent =
      (loadedVersion || 'local') + ' · ' + probe.screen + ' · ' +
      'start' + probe.starts + ' move' + probe.moves + ' end' + probe.ends +
      (probe.cancels ? ' cancel' + probe.cancels : '') +
      ' · ' + probe.stop;

    if (!state.devOpen) { return; }
    var body = el('debug-body');
    var head =
      'build=' + (loadedVersion || 'local') +
      ' touch=' + ('ontouchstart' in window) +
      ' standalone=' + isStandalone() +
      ' w=' + Math.round(probe.width || frameWidth()) + '\n' +
      'gesture: screen=' + probe.screen + ' mode=' + probe.mode +
      ' dx=' + Math.round(probe.dx) + ' dy=' + Math.round(probe.dy) +
      ' stop=' + probe.stop + '\n' +
      'touch-action=' + probe.touchAction + '\n' +
      '----\n';
    var stuckToBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 24;
    body.textContent = head + (debugLines.length ? debugLines.join('\n') : '(' + t('dev.empty') + ')');
    if (stuckToBottom) { body.scrollTop = body.scrollHeight; }
  }

  function note(field, value) {
    probe[field] = value;
    renderDebug();
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
      if (e.target && e.target.closest && e.target.closest('#debug-panel')) {
        note('stop', 'debug-panel');            // the window scrolls on its own
        return;
      }
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
        debugLog('gesture ' + mode + ' ' + screenName(dragged) + ' -> ' + partnerName);
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
      var commit = Math.abs(dx) > width * COMMIT_RATIO || speed > FLING_SPEED;
      debugLog('gesture end dx=' + Math.round(dx) + ' v=' + speed.toFixed(2) +
        ' -> ' + (commit ? 'commit ' + partnerName : 'spring back'));
      settle(commit, dx);
    }

    surface.addEventListener('touchend', function () {
      probe.ends += 1;
      renderDebug();
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
      debugLog('diary + activity ' + state.draft.type + ' ' + kcal + 'kcal at ' + nowLabel() +
        ' (entries now ' + state.entries.length + ')');
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
        debugLog('on-device ' + (result.food
          ? result.food.id + ' ' + Math.round(result.food.probability * 100) + '%'
          : 'nothing') +
          (result.guesses.length
            ? ' · also ' + result.guesses.map(function (g) {
              return g.id + ' ' + Math.round(g.probability * 100) + '%';
            }).join(', ')
            : ''));
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
      debugLog('cloud -> ' + config.model + ' at ' + config.endpoint);
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
          var info = result.debug || {};
          var reason = 'cloud.nothing';
          if (info.imageLikelyIgnored) {
            // The give-away: a prompt too small to have contained the photo.
            reason = 'cloud.blind';
          } else if (info.emptyContent && info.finish === 'length') {
            reason = 'cloud.allThinking';
          } else if (info.finish === 'length') {
            reason = 'cloud.truncated';
          }
          photoNote(t(reason, { model: result.model }), true);
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

    ['p-first', 'p-last'].forEach(function (id) {
      el(id).addEventListener('input', function () {
        state.person[id === 'p-first' ? 'first' : 'last'] = this.value.slice(0, 30);
        save();
        renderPerson();
      });
    });

    el('person-avatar').addEventListener('click', function () {
      var picker = el('avatar-pick');
      picker.hidden = !picker.hidden;
    });

    el('avatar-file').addEventListener('change', function () {
      var file = this.files && this.files[0];
      this.value = '';
      if (file) { storeAvatarPhoto(file); }
    });

    el('avatar-clear').addEventListener('click', function () {
      state.person.photo = null;
      state.person.icon = '';
      save();
      renderPerson();
    });

    el('period-prev').addEventListener('click', function () {
      state.statsAnchor = dateKey(shiftAnchor(state.statsPeriod, statsAnchorDate(), -1));
      save();
      renderStats();
    });

    el('period-next').addEventListener('click', function () {
      if (this.disabled) { return; }
      state.statsAnchor = dateKey(shiftAnchor(state.statsPeriod, statsAnchorDate(), 1));
      save();
      renderStats();
    });

    el('dev-switch').addEventListener('click', function (e) {
      var picked = e.target.closest('[data-dev]');
      if (!picked) { return; }
      state.devMode = picked.getAttribute('data-dev') === 'on';
      save();
      renderProfile();
      renderDebug();
    });

    el('debug-toggle').addEventListener('click', function () {
      state.devOpen = !state.devOpen;
      save();
      renderDebug();
    });

    el('debug-clear').addEventListener('click', function () {
      debugLines.length = 0;
      renderDebug();
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
      debugLog('diary + meal ' + state.meal.type + ' ' + m.kcal + 'kcal at ' + nowLabel() +
        ' (entries now ' + state.entries.length + ')');
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
  var versionReloaded = false;

  /* Asks the worker to forget the shell - the pages and scripts - while keeping
     the model and the runtime, which are tens of megabytes and never change in
     place. */
  function clearShell() {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      var channel = new MessageChannel();
      var settled = false;
      channel.port1.onmessage = function () { settled = true; resolve(); };
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_SHELL' }, [channel.port2]);
      setTimeout(function () { if (!settled) { resolve(); } }, 1500);
    });
  }

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
      renderDebug();
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
        /* Reloading alone is not enough: the cached shell and the browser's own
           HTTP cache can each hand back the build we are trying to leave. Drop
           the shell, then return on a URL neither of them has seen. */
        clearShell().then(function () {
          setTimeout(function () {
            location.replace(location.pathname + '?v=' + Date.now() + location.hash);
          }, 600);
        });
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
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        if (!reg) { return; }
        /* A worker sitting in `waiting` means a newer build is downloaded and
           held back until every tab closes - which, for an installed app, may
           be never. Let it take over now. */
        if (reg.waiting) { reg.waiting.postMessage({ type: 'SKIP_WAITING' }); }
        reg.addEventListener('updatefound', function () {
          var incoming = reg.installing;
          if (!incoming) { return; }
          incoming.addEventListener('statechange', function () {
            if (incoming.state === 'installed' && navigator.serviceWorker.controller) {
              incoming.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })['catch'](function () { /* offline support is optional */ });
    });

    // A new worker taking control means new files: come back on them once.
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (versionReloaded) { return; }
      versionReloaded = true;
      location.reload();
    });
  }
}());
