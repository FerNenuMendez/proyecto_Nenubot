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
      const pasaporteRowLastDate = table
        .getByText("renovación y primera vez")
        .locator("..")
        .locator("..")
        .locator("td:nth-child(2)");

      const lastDate = await pasaporteRowLastDate.innerText();

      const pasaporteRowDate = table
        .getByText("renovación y primera vez")
        .locator("..")
        .locator("..")
        .locator("td:nth-child(3)");

      const text = await pasaporteRowDate.innerText();

      if (!lastDate) {
        logger.warn("No se encontró fecha en la tabla.");
        return;
      }

      const parsedDate = parse(`${lastDate}`, "DD/MM/YYYY");

      if (text !== "fecha por confirmar") {
        formatDateLATAM(`${parsedDate}`);
        logger.info("Enviando mensaje de Telegram...");
        await fetch(
          `https://api.telegram.org/bot${
            process.env.TELEGRAM_key
          }/sendMessage?chat_id=@NenuBotRMG&text=${encodeURIComponent(
            `🚨🚨🇪🇸 La página del consulado Español acaba de publicar la próxima apertura de fechas para pasaportes: ${text}. 
☣️ Fueron avisados por NenuBot 🤖`
          )}`
        );
        logger.info("Mensaje de Telegram enviado.");
      } else {
        logger.info(
          "No hay nuevos turnos para pasaporte habilitados en la web."
        );
      }

      await page.close();
    } catch (error) {
      logger.error(`Error en la ejecución del bot: ${error.message}`);
    }
  });
}
