import { webkit } from "playwright";
import cron from "node-cron";
import logger from "../logger.js";

process.loadEnvFile();

const browser = await webkit.launch();
const user = process.env.USER_A;
const pss = process.env.PSS_USER_A;

export function turnosPasaporteEspontanea() {
  cron.schedule("* * * * *", async () => {
    const page = await browser.newPage();
    try {
      //Inicio de la navegacion
      logger.info("Iniciando proceso de logueo...");
      await page.goto(
        "https://www.cgeonline.com.ar/tramites/citas/modificar/modificar-cita-consulado.html"
      );

      // Esperar reCAPTCHA y completar usuario/contraseña
      await page.waitForSelector("iframe[title='reCAPTCHA']");
      await page.fill("input[name='IDU']", `${user}`);
      await page.fill("input[name='pass']", `${pss}`);

      // Manejo del CAPTCHA (puede necesitar intervención manual)
      const frame = page.frameLocator("iframe[title='reCAPTCHA']");
      await frame.locator("span[role='checkbox']").click();

      // Click en el botón de envío
      await page.waitForSelector("#btnSubmit", { timeout: 5000 });
      await Promise.all([
        page.waitForLoadState("domcontentloaded"), // Espera a que la nueva página cargue
        page.click("#btnSubmit"),
      ]);

      logger.info("Logueo para turno de renovación de Pasaporte exitoso");

      // Extraer el mensaje de la nueva página
      await page.waitForSelector("#aviso-apertura", { timeout: 10000 });
      const avisoTexto = await page.locator("#aviso-apertura").innerText();

      logger.info(`Texto del aviso: ${avisoTexto}`);
      await page.close();
    } catch (error) {
      logger.error(`Error de logueo: ${error.message}`);
      logger.error(error.stack);
    } finally {
      await page.close(); // Cierre seguro de la página
    }
  });
}
