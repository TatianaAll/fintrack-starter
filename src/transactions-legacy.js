// FinTrack — Module historique de gestion des transactions
//
// ⚠ ATTENTION : Ce fichier date des débuts du projet (2019).
//   Il fonctionne mais il est devenu difficile à maintenir.
//   Personne dans l'équipe actuelle ne l'a écrit.
//
//   La direction a demandé un audit complet de ce module.
//   À toi de jouer.

// ============================================================================

const TYPES = ["credit", "debit", "transfer"];

// fonction utilitaire (utilisée nulle part ailleurs ?)
function fmt(d) {
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return dd + "/" + mm + "/" + yyyy;
}

// fonction de normalisation des données optionnelles passée pour créer les transactions
export function normalizeOptions(opts) {
  const normalized = {};

  const now = new Date();

  // si opts absentes ou non valides
  if (!opts || typeof opts !== "object") {
    opts = {};
  }

  normalized.currency = opts.currency || "EUR";
  normalized.month = opts.month ? opts.month : now.getMonth();
  normalized.year = opts.year ? opts.year : now.getFullYear();
  normalized.threshold = opts.threshold === undefined ? 1000 : opts.threshold;

  return normalized;
}

// fonction de validation du type de transaction
export function isTypeValid(type) {
  // on vérifie le type
  for (let j = 0; j < TYPES.length; j++) {
    if (TYPES[j] === type) return true;
  }
  return false;
}

// fonction de validation du montant de la transaction + creation d'erreur
export function validateAmount(transaction, index, errors) {
  // on vérifie le montant
  if (transaction.amount === undefined || transaction.amount === null) {
    errors.push("transaction " + index + " has no amount");
    return false;
  }
  if (typeof transaction.amount !== "number") {
    errors.push("transaction " + index + " amount is not a number");
    return false;
  }
  if (transaction.amount < 0) {
    errors.push("transaction " + index + " has negative amount");
    return false;
  }
  return true;
}

// fonction de modification du montant selon la monnaie utilisée
export function convertAmountDependingCurrency(
  transactionCurrency,
  optionCurrency,
  transactionAmount,
) {
  // conversion devise si besoin
  if (transactionCurrency && transactionCurrency !== optionCurrency) {
    // taux en dur, à mettre à jour à la main tous les mois...
    let rate = 0;
    if (transactionCurrency === "USD" && optionCurrency === "EUR") {
      rate = 0.92;
    } else if (transactionCurrency === "EUR" && optionCurrency === "USD") {
      rate = 1.08;
    } else if (transactionCurrency === "GBP" && optionCurrency === "EUR") {
      rate = 1.17;
    } else if (transactionCurrency === "EUR" && optionCurrency === "GBP") {
      rate = 0.85;
    } else {
      rate = 1; // fallback
    }
    return transactionAmount * rate;
  } else {
    return transactionAmount;
  }
}

// fonction de catégorisation de la transaction
export function categorizeTransaction(transactionLabel) {
  // catégorisation manuelle (devrait être dans la donnée mais bon...)
  if (transactionLabel) {
    let lab = transactionLabel.toLowerCase();
    if (lab.indexOf("loyer") >= 0 || lab.indexOf("rent") >= 0) {
      return "logement";
    } else if (
      lab.indexOf("course") >= 0 ||
      lab.indexOf("groce") >= 0 ||
      lab.indexOf("super") >= 0
    ) {
      return "alimentation";
    } else if (
      lab.indexOf("essence") >= 0 ||
      lab.indexOf("gas") >= 0 ||
      lab.indexOf("uber") >= 0
    ) {
      return "transport";
    } else if (
      lab.indexOf("netflix") >= 0 ||
      lab.indexOf("spotify") >= 0 ||
      lab.indexOf("cinema") >= 0
    ) {
      return "loisirs";
    } else if (lab.indexOf("salaire") >= 0 || lab.indexOf("salary") >= 0) {
      return "revenu";
    } else {
      return "autre";
    }
  } else {
    return "autre";
  }
}

function applyTransactionImpact(transactionType, amount, totals) {
  if (transactionType === "credit") {
    return {
      total: totals.total + amount,
      totalCredit: totals.totalCredit + amount,
      totalDebit: totals.totalDebit,
      nbCredit: totals.nbCredit + 1,
      nbDebit: totals.nbDebit,
    };
  }

  if (transactionType === "debit") {
    return {
      total: totals.total - amount,
      totalCredit: totals.totalCredit,
      totalDebit: totals.totalDebit + amount,
      nbCredit: totals.nbCredit,
      nbDebit: totals.nbDebit + 1,
    };
  }

  return totals; // transfer
}

// THE function
export function processTransactions(txs, opts) {
  let result = [];
  let total = 0;
  let totalCredit = 0;
  let totalDebit = 0;
  let nbCredit = 0;
  let nbDebit = 0;
  let errors = [];
  let warnings = [];
  let tx;
  let category;

  // si pas d'options on met des valeurs par défaut via la fonction normalizeOptions
  const { currency, month, year, threshold } = normalizeOptions(opts);

  // boucle principale
  for (let i = 0; i < txs.length; i++) {
    tx = txs[i];

    // on filtre par mois et par année
    let d = new Date(tx.date);
    if (d.getMonth() !== month) {
      continue;
    }
    if (d.getFullYear() !== year) {
      continue;
    }

    const isTypeOk = isTypeValid(tx.type);
    if (!isTypeOk) {
      errors.push("transaction " + i + " has invalid type");
      continue;
    }

    // on vérifie le montant avec une fonction autre
    if (!validateAmount(tx, i, errors)) {
      continue;
    }

    // convertion selon la monnaie
    let converted = convertAmountDependingCurrency(
      tx.currency,
      currency,
      tx.amount,
    );

    // categorisation de la dépense
    category = categorizeTransaction(tx.label);

    // alertes
    if (converted > threshold && tx.type === "debit") {
      warnings.push(
        "transaction " +
          i +
          " depasse le seuil (" +
          converted +
          " > " +
          threshold +
          ")",
      );
    }

    ({ total, totalCredit, totalDebit, nbCredit, nbDebit } =
      applyTransactionImpact(tx.type, converted, {
        total,
        totalCredit,
        totalDebit,
        nbCredit,
        nbDebit,
      }));

    // construction de l'objet de sortie
    let item = {};
    item.id = tx.id;
    item.date = fmt(d);
    item.label = tx.label || "(sans libellé)";
    item.amount = converted;
    item.originalAmount = tx.amount;
    item.originalCurrency = tx.currency || currency;
    item.currency = currency;
    item.type = tx.type;
    item.category = category;
    item.flagged = converted > threshold && tx.type === "debit";
    result.push(item);
  }

  // tri par date (un peu pourri mais ça marche)
  result.sort(function (a, b) {
    let pa = a.date.split("/");
    let pb = b.date.split("/");
    let da = new Date(pa[2], pa[1] - 1, pa[0]);
    let db = new Date(pb[2], pb[1] - 1, pb[0]);
    if (da < db) return -1;
    if (da > db) return 1;
    return 0;
  });

  // moyenne (au cas ou)
  let avgCredit = 0;
  if (nbCredit > 0) {
    avgCredit = totalCredit / nbCredit;
  }
  let avgDebit = 0;
  if (nbDebit > 0) {
    avgDebit = totalDebit / nbDebit;
  }

  return {
    transactions: result,
    total: total,
    totalCredit: totalCredit,
    totalDebit: totalDebit,
    nbCredit: nbCredit,
    nbDebit: nbDebit,
    avgCredit: avgCredit,
    avgDebit: avgDebit,
    errors: errors,
    warnings: warnings,
  };
}
