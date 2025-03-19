import { webkit } from "playwright";
import cron from "node-cron";
import logger from "../logger.js";

process.loadEnvFile();

const browser = await webkit.launch();

export function iduNumeroBot() {
  cron.schedule("1 8 * * *", async () => {
    try {
      const page = await browser.newPage();
      await page.goto(
        "https://www.exteriores.gob.es/Consulados/buenosaires/es/Comunicacion/Noticias/Paginas/Articulos/202200907_NOT02.aspx"
      );

      const strongElement = page.locator("strong.ms-rteForeColor-8").first();
      const text = await strongElement.innerText();
      const idu = text.match(/NW-\d{4}-\d+/);
      const iduHardCodeado = "NW-2023-238450";

      if (`${idu}` !== iduHardCodeado) {
        logger.info(`Nuevos IDU's habilitados, hasta el IDU: ${idu}`);
        logger.info("Enviando mensaje de Telegram...");
        await fetch(
          `https://api.telegram.org/bot${
            process.env.TELEGRAM_key
          }/sendMessage?chat_id=@NenuBotRMG&text=${encodeURIComponent(
            `🚨🚨🇪🇸 La página del consulado Español acaba de publicar la próxima apertura de IDU's para la la ciudadania por Ley de Memoria Democratica.
Los IDU's habilitados van hasta el: ${idu}. 
☣️ Fueron avisados por NenuBot 🤖`
          )}`
        );
        logger.info("Mensaje de Telegram enviado.");
        logger.info("CAMBIAR IDUHARDCODEADO");
      } else {
        logger.info("Enviando mensaje de Telegram...");
        await fetch(
          `https://api.telegram.org/bot${
            process.env.TELEGRAM_key
          }/sendMessage?chat_id=@NenuBotRMG&text=${encodeURIComponent(
            `❌❌🇪🇸 NO hay CAMBIO DE IDU's habilitados en la web. 
☣️ Fueron avisados por NenuBot 🤖`
          )}`
        );
        logger.info("Mensaje de Telegram enviado.");
        logger.info("No hay cambios de IDU's habilitados en la web.");
      }

      await page.close();
    } catch (error) {
      logger.error(`Error en la ejecución del bot: ${error.message}`);
    }
  });
}
