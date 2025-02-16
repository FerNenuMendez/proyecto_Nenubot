import { webkit } from "playwright";
import { isAfter, parse } from "@formkit/tempo";
import cron from "node-cron";
import logger from "./src/logger.js";

process.loadEnvFile();

const browser = await webkit.launch();

cron.schedule("* * * * *", async () => {
  const page = await browser.newPage();

  await page.goto(
    "https://www.cgeonline.com.ar/informacion/apertura-de-citas.html"
  );

  const table = page.locator("table");

  const pasaporteRow = table
    .getByText("renovación y primera vez")
    .locator("..")
    .locator("..")
    .locator("td:nth-child(3)");

  const nextDate = await pasaporteRow.innerText();

  const [date, time] = nextDate.split(" a las ");

  const parseDate = parse(`${date} ${time}`, "DD/MM/YYYY hh:mm");
  console.log(`${parseDate}`);

  if (isAfter(parseDate, new Date())) {
    logger.info(`Enviando Mensaje de Telegram...`);
    await fetch(
      `https://api.telegram.org/bot${
        process.env.TELEGRAM_key
      }/sendMessage?chat_id=@NenuBotRMG&text=${encodeURIComponent(
        `🚨🚨 La pagina del consulado Español acaba de publicar que la proxima apertura de fechas para pasaportes es el: 
  
    📍 ${parseDate}. 

☣️ Fueron avisados por NenuBot 🤖`
      )}`
    );
    logger.info(`Mensaje de Telegram Enviado!`);
  } else {
    logger.info("No hay nuevos turnos");
  }
  page.close();
});

//browser.close();
