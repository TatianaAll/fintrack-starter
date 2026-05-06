import { test, expect } from "@playwright/test";

test("L'utilisateur peut télécharger un csv avec les données de transaction du mois en cours", async ({
  page,
}) => {
  // L'utilisateur va sur la page d'accueil avec goto
  await page.goto("/");

  // attend l'apparition du bouton pour export en CSV
  await expect(
    page.getByRole("button", { name: "Exporter en CSV" }),
  ).toBeVisible();
  // on s'attend à avoir un event de type téléchargement
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    // On click sur le bouton export en CSV
    page.getByRole("button", { name: "Exporter en CSV" }).click(),
  ]);
  // on vérifie que ce qu'on a téléchargé contient bien l'extension .csv
  expect(download.suggestedFilename()).toContain(".csv");
});
