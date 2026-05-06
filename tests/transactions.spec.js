/* Scénario à développer
1. L’utilisateur arrive sur la page d’accueil.
2. Il clique sur le bouton « Ajouter une transaction ».
3. Il remplit le formulaire (libellé, montant, catégorie).
4. Il valide.
5. La nouvelle transaction apparaît dans la liste avec les bonnes valeurs

La doc de playwrights --> https://playwright.dev/docs/intro 
*/

import { test, expect } from "@playwright/test";

test("L’utilisateur peut ajouter une transaction et la voir dans la liste", async ({
  page,
}) => {
  // L'utilisateur va sur la page d'accueil avec goto
  await page.goto("/");

  // On stocke la donnée de début pour le débit du mois
  const debitDebutText = await page.getByTestId("debit").textContent();
  const debitDebut = parseFloat(debitDebutText.replace(/[^\d.-]/g, ""));

  // attend l'apparition du bouton ajouter une transaction
  await expect(
    page.getByRole("button", { name: "Ajouter une transaction" }),
  ).toBeVisible();
  // click sur ledit bouton
  await page.getByRole("button", { name: "Ajouter une transaction" }).click();

  // Remplis le formulaire en récupérant les labels des input et complète avec fill()
  await page.getByLabel("Libellé").fill("Achat jeu steam");
  await page.getByLabel("Montant").fill("33.00");
  await page.getByLabel("Type").selectOption("debit");
  await page.getByLabel("Catégorie").selectOption("loisirs");
  // Valide le formulaire
  await page.getByRole("button", { name: "Valider" }).click();

  // On stocke la donnée de fin pour le débit du mois
  const debitFinText = await page.getByTestId("debit").textContent();
  const debitFin = parseFloat(debitFinText.replace(/[^\d.-]/g, ""));

  const newTransaction = page.locator(".tx").first();
  await expect(newTransaction.getByText("Achat jeu steam")).toBeVisible();
  await expect(newTransaction.getByText("Loisirs")).toBeVisible();
  await expect(newTransaction.getByText("- 33.00 €")).toBeVisible();

  await expect(debitFin).toEqual(-(Math.abs(debitDebut) + 33));
});
