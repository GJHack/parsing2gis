/*
Данный скрип называется "Пошел нахуй, 2гис". Фирменная разработка.
Тут мы скрапим тугис, поднимаем сервер с api для получения нужной
нам инфы. Все изи. Удачи в чтении.
Если вдруг не знаешь экспресс и папитир то лови ссылки:
https://expressjs.com/ru/ - Сервер
https://pptr.dev/ - Эмуляция ядра хрома
*/
const puppeteer = require('puppeteer'),
      express = require('express'),
      app = express(),
      port = 3300,
      url = `https://2gis.ru/nahodka/firm/(ID компании 2gis)/tab/reviews`; /// Заменить на ID компании

let isCoolDown = false,
    doneReviews = [];
    scrape = async () => {
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();
      await page.goto(`${url}`);
      await page.waitForTimeout(2000);
      const result = await page.evaluate(() => {
        //._yqieuf
        let data = [];

        let elements = document.querySelectorAll('._yqieuf'); // Выбираем все товары ( если что, селекторы классов можно глянуть через DevTools на странице компании )

               for (var element of elements){ // Проходимся в цикле по каждому отзыву
                   let text = element.innerText; // Внутренний текст
                   text = text.split('\n'); // Убираем переносы
                   ///От здесь
                   if(text.length>4) {
                     text.splice(0,1); 
                     text.splice(3,1);
                   }
                   //text[0] = text[0].replace(/\d/,` $&`)
                   text[0] = text[0].replace(/\d/,` $&`)
                   text[0] = text[0].split(' ');
                   text[0].pop();
                   text[0].pop();
                   text[0] = text[0].join(' ');
                   if(text.length>3){
                     text.pop();
                   }
                   if(text.length>3){
                     text.pop();
                   }

                   /// до здесь, мы форматируем полученнный текст. Убирается все лишнее. Оставил только Имя, Дату отзыва. Отзыв.
                   data.push(text); // И пушим в массив
               }

               return data; // Возвращаем массив
           });

        browser.close();
        return result;
};

function getReviews() {
  setTimeout(() => {
    getReviews();
  },9000);
  scrape().then((value) => {
      doneReviews = value;
      console.log(value);
    });
}
getReviews();


/////////ФОРМИРУЕМ ОТВЕТЫ СЕРВЕРА(Роутинг)///////////
app.get('/2gis', function(req, res) {
  res.json(doneReviews);
});
app.get('/', function(req, res) {
  res.send(
    `<h1
      style="background-color: red;
             width: 200px"}>
      Route
      </h1>
      <p> '/' Главная страница <br>
          '/2gis' Получение отзывов с 2gis <br>
          '/insta' Что то с инстой <br>
      </p>
      `
  )
});

////////Слушаем порт/////////

app.listen(port, () => {
  console.log(`Scrap 2gis server run now! => http://localhost:${port}`);
})
