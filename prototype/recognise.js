/* FitBalance — on-device food recognition.

   MobileNet V2, trained on ImageNet-1k, run through TensorFlow.js. Both the
   runtime and the weights are served from this origin, so after the first load
   the whole thing works offline and the picture never leaves the page:

       <img> -> tensor -> logits -> the food classes this app knows about

   ImageNet has around forty food classes. That is the honest ceiling of this
   model: fast food, fruit, vegetables and baked goods are covered, a home-cooked
   plate of chicken and rice is not. See docs/on-device-recognition.md. */

window.FoodRecognition = (function () {
  'use strict';

  var TF_SRC = 'vendor/tf.min.js';
  var MODEL_URL = 'model/mobilenet-v2/model.json';
  var INPUT_SIZE = 224;

  /* The model outputs 1001 logits: index 0 is the "background" class TF-Hub
     models carry, so the ImageNet classes start one further along. */
  var BACKGROUND_OFFSET = 1;

  /* Below this the top class is not confident enough to be presented as the
     answer — it is offered as an alternative instead. */
  var ACCEPT = 0.12;
  /* A food class weaker than this is not worth offering at all. */
  var SUGGEST = 0.02;

  /* ImageNet class index -> what this app knows about that food.
     `kcal` is per 100 g; `portion` is the serving the draft starts from, in
     grams — a starting point the user is expected to correct, not a
     measurement. */
  var FOODS = {
    924: { id: 'guacamole', ru: 'Гуакамоле', en: 'Guacamole', kcal: 155, portion: 60 },
    925: { id: 'consomme', ru: 'Бульон', en: 'Consommé', kcal: 20, portion: 250 },
    926: { id: 'hotpot', ru: 'Рагу в горшочке', en: 'Hot pot', kcal: 120, portion: 350 },
    927: { id: 'trifle', ru: 'Трайфл', en: 'Trifle', kcal: 220, portion: 150 },
    928: { id: 'icecream', ru: 'Мороженое', en: 'Ice cream', kcal: 207, portion: 100 },
    929: { id: 'icelolly', ru: 'Фруктовый лёд', en: 'Ice lolly', kcal: 80, portion: 70 },
    930: { id: 'baguette', ru: 'Багет', en: 'Baguette', kcal: 270, portion: 80 },
    931: { id: 'bagel', ru: 'Бейгл', en: 'Bagel', kcal: 250, portion: 100 },
    932: { id: 'pretzel', ru: 'Крендель', en: 'Pretzel', kcal: 380, portion: 50 },
    933: { id: 'cheeseburger', ru: 'Чизбургер', en: 'Cheeseburger', kcal: 250, portion: 200 },
    934: { id: 'hotdog', ru: 'Хот-дог', en: 'Hot dog', kcal: 290, portion: 150 },
    935: { id: 'mashedpotato', ru: 'Картофельное пюре', en: 'Mashed potato', kcal: 90, portion: 200 },
    936: { id: 'cabbage', ru: 'Капуста', en: 'Cabbage', kcal: 25, portion: 150 },
    937: { id: 'broccoli', ru: 'Брокколи', en: 'Broccoli', kcal: 34, portion: 150 },
    938: { id: 'cauliflower', ru: 'Цветная капуста', en: 'Cauliflower', kcal: 25, portion: 150 },
    939: { id: 'zucchini', ru: 'Кабачок', en: 'Courgette', kcal: 17, portion: 150 },
    940: { id: 'spaghettisquash', ru: 'Тыква спагетти', en: 'Spaghetti squash', kcal: 31, portion: 200 },
    941: { id: 'acornsquash', ru: 'Тыква', en: 'Acorn squash', kcal: 40, portion: 200 },
    942: { id: 'butternutsquash', ru: 'Тыква баттернат', en: 'Butternut squash', kcal: 45, portion: 200 },
    943: { id: 'cucumber', ru: 'Огурец', en: 'Cucumber', kcal: 15, portion: 100 },
    944: { id: 'artichoke', ru: 'Артишок', en: 'Artichoke', kcal: 47, portion: 120 },
    945: { id: 'bellpepper', ru: 'Болгарский перец', en: 'Bell pepper', kcal: 26, portion: 100 },
    947: { id: 'mushroom', ru: 'Грибы', en: 'Mushrooms', kcal: 22, portion: 100 },
    948: { id: 'apple', ru: 'Яблоко', en: 'Apple', kcal: 52, portion: 180 },
    949: { id: 'strawberry', ru: 'Клубника', en: 'Strawberries', kcal: 33, portion: 150 },
    950: { id: 'orange', ru: 'Апельсин', en: 'Orange', kcal: 47, portion: 150 },
    951: { id: 'lemon', ru: 'Лимон', en: 'Lemon', kcal: 29, portion: 60 },
    952: { id: 'fig', ru: 'Инжир', en: 'Figs', kcal: 74, portion: 100 },
    953: { id: 'pineapple', ru: 'Ананас', en: 'Pineapple', kcal: 50, portion: 150 },
    954: { id: 'banana', ru: 'Банан', en: 'Banana', kcal: 89, portion: 120 },
    955: { id: 'jackfruit', ru: 'Джекфрут', en: 'Jackfruit', kcal: 95, portion: 150 },
    956: { id: 'custardapple', ru: 'Черимойя', en: 'Custard apple', kcal: 94, portion: 150 },
    957: { id: 'pomegranate', ru: 'Гранат', en: 'Pomegranate', kcal: 83, portion: 150 },
    959: { id: 'carbonara', ru: 'Паста карбонара', en: 'Pasta carbonara', kcal: 350, portion: 300 },
    960: { id: 'chocolatesauce', ru: 'Шоколадный соус', en: 'Chocolate sauce', kcal: 350, portion: 30 },
    961: { id: 'dough', ru: 'Тесто', en: 'Dough', kcal: 300, portion: 100 },
    962: { id: 'meatloaf', ru: 'Мясной рулет', en: 'Meat loaf', kcal: 230, portion: 200 },
    963: { id: 'pizza', ru: 'Пицца', en: 'Pizza', kcal: 266, portion: 300 },
    964: { id: 'potpie', ru: 'Пирог с начинкой', en: 'Pot pie', kcal: 240, portion: 250 },
    965: { id: 'burrito', ru: 'Буррито', en: 'Burrito', kcal: 210, portion: 250 },
    966: { id: 'redwine', ru: 'Красное вино', en: 'Red wine', kcal: 85, portion: 150 },
    967: { id: 'espresso', ru: 'Эспрессо', en: 'Espresso', kcal: 9, portion: 30 },
    969: { id: 'eggnog', ru: 'Эггног', en: 'Eggnog', kcal: 135, portion: 200 },
    987: { id: 'corn', ru: 'Кукуруза', en: 'Corn', kcal: 96, portion: 150 }
  };

  var BY_ID = {};
  Object.keys(FOODS).forEach(function (index) { BY_ID[FOODS[index].id] = FOODS[index]; });

  var tfPromise = null;
  var modelPromise = null;
  var model = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var tag = document.createElement('script');
      tag.src = src;
      tag.onload = function () { resolve(); };
      tag.onerror = function () { reject(new Error('cannot load ' + src)); };
      document.head.appendChild(tag);
    });
  }

  function loadTf() {
    if (window.tf) { return Promise.resolve(window.tf); }
    if (!tfPromise) {
      tfPromise = loadScript(TF_SRC).then(function () {
        if (!window.tf) { throw new Error('tf missing after load'); }
        return window.tf;
      }).catch(function (err) {
        tfPromise = null;                       // let the next attempt retry
        throw err;
      });
    }
    return tfPromise;
  }

  /* Downloads the runtime and the weights once, then keeps them in memory.
     `onProgress` is called with 0..1 while the weights come down — on a phone
     this is a 14 MB download, so it needs to be visible. */
  function load(onProgress) {
    if (modelPromise) { return modelPromise; }
    modelPromise = loadTf().then(function (tf) {
      return tf.loadGraphModel(MODEL_URL, {
        onProgress: function (fraction) {
          if (onProgress) { onProgress(fraction); }
        }
      });
    }).then(function (loaded) {
      model = loaded;
      return loaded;
    }).catch(function (err) {
      modelPromise = null;                      // a failed download must not stick
      throw err;
    });
    return modelPromise;
  }

  /* MobileNet V2 from TF-Hub expects RGB in [0, 1] at 224x224. */
  function toInput(tf, source) {
    return tf.tidy(function () {
      var pixels = tf.browser.fromPixels(source).toFloat();
      var resized = tf.image.resizeBilinear(pixels, [INPUT_SIZE, INPUT_SIZE], false);
      return resized.div(255).expandDims(0);
    });
  }

  function describe(index, prob) {
    var food = FOODS[index];
    return {
      id: food.id,
      ru: food.ru,
      en: food.en,
      kcal: food.kcal,
      portion: food.portion,
      probability: prob
    };
  }

  /* Runs the picture through the model and reports the food classes it found,
     strongest first. Resolves with { food, guesses, confident } where `food` is
     null when nothing edible was recognised. */
  function classify(source) {
    return load().then(function (loaded) {
      var tf = window.tf;
      var input = toInput(tf, source);
      var logits = loaded.predict(input);
      var probs = tf.tidy(function () {
        var trimmed = logits.shape[1] > 1000
          ? tf.slice(logits, [0, BACKGROUND_OFFSET], [-1, 1000])
          : logits;
        return tf.softmax(trimmed);
      });

      return probs.data().then(function (values) {
        input.dispose();
        logits.dispose();
        probs.dispose();

        var found = Object.keys(FOODS)
          .map(function (index) { return describe(index, values[index]); })
          .filter(function (item) { return item.probability >= SUGGEST; })
          .sort(function (a, b) { return b.probability - a.probability; });

        var best = found[0] || null;
        return {
          food: best && best.probability >= ACCEPT ? best : null,
          confident: !!best && best.probability >= ACCEPT,
          guesses: found.slice(best && best.probability >= ACCEPT ? 1 : 0, 4)
        };
      });
    });
  }

  /* iOS Safari in particular holds a tight per-tab memory budget, so the model
     is released when the photo screen is left. */
  function unload() {
    if (model) {
      model.dispose();
      model = null;
      modelPromise = null;
    }
  }

  function byId(id) { return BY_ID[id] || null; }

  return {
    load: load,
    classify: classify,
    unload: unload,
    byId: byId,
    isLoaded: function () { return !!model; }
  };
})();
