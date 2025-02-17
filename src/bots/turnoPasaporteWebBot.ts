import { webkit } from "playwright";
import { isAfter, parse } from "@formkit/tempo";
import cron from "node-cron";
import logger from "../logger.js";
import { formatDateLATAM } from "../utils.ts";

process.loadEnvFile();

const browser = await webkit.launch();

export function turnoPasaporteWebBot() {
  cron.schedule("* * * * *", async () => {
    try {
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

      if (!nextDate) {
        logger.warn("No se encontró fecha en la tabla.");
        return;
      }

      const [date, time] = nextDate.split(" a las ");
      const parsedDate = parse(`${date} ${time}`, "DD/MM/YYYY hh:mm");

      formatDateLATAM(`${parsedDate}`);
      console.log(`${parsedDate}`);

      if (isAfter(parsedDate, new Date())) {
        logger.info("Enviando mensaje de Telegram...");
        await fetch(
          `https://api.telegram.org/bot${
            process.env.TELEGRAM_key
          }/sendMessage?chat_id=@NenuBotRMG&text=${encodeURIComponent(
            `🚨🚨 La página del consulado Español acaba de publicar que la próxima apertura de fechas para pasaportes es el: 📍 ${parsedDate}. ☣️ Fueron avisados por NenuBot 🤖`
          )}`
        );
        logger.info("Mensaje de Telegram enviado.");
      } else {
        logger.info("No hay nuevos turnos.");
      }

      await page.close();
    } catch (error) {
      logger.error(`Error en la ejecución del bot: ${error.message}`);
    }
  });
}
