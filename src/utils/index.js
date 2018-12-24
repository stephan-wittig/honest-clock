/* Änderungshistorie
* Zweck des Dokuments: Sammlung für jegliche (mathematische) Funktionen, die ausgelagert werden können
*
* Änderungen: Einfügen der Funktionen
* Name: Lucas
* Datum: 19.11.2018
* Änderung vorgenommen: Funktionen eingefügt
*
* Name: Selina
* Datum: 07.12.2018
* Änderung vorgenommen: Max. Stellen des Kilometerstands auf 9 gesetzt
*
*/

export function getFinError(fin) {
  if (fin.length === 17) {
    let letter_map, weights, sum, mod;

    //in Großbuchstaben
    fin = fin.toUpperCase();
    //I O und Q nicht erlauben
    if (!fin.match("^([0-9a-hj-npr-zA-HJ-NPR-Z]{10,17})+$")) {
      return true;
    }

    //Buchstaben Wert zuschreiben (Vorgegeben)
    letter_map = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9, 'S': 2, 'T': 3,
      'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9, '1': 1, '2': 2, '3': 3,
      '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
    };

    //Gewichte nach Position (vorgegeben)
    weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    //Add weights
    for (var i = 0; i < fin.length; i++) {
      sum += letter_map[fin.charAt(i)] * weights[i];
    }
    //Modulo
    mod = sum % 11;

    //ist Prüfziffer an 8. Stelle = mod, falls Ja, dann ist Fin richtig
    return fin.charAt(8) != mod;
  } else return fin.length !== 0;
}

//False wenn nur km nur Zahlen enthält, true wenn km nicht nur Zahlen enthält
export function getKmError(km) {
  if (km.length === 0) {
    return false
  }
  if (km.length >9){
    return true
  }
  else {
    return !km.match("^\\d+$");
  }
}

export function Block2Date(latestBlock, transactionBlock) {
  let blockzeit = 15 * 1000; //in Sekunden*1000 --> Millisekunden
  let datumBlock = Date.now() - (blockzeit * (latestBlock - transactionBlock)); //Formel zur Berechnung des Datums des Blocks

  //Datum des transactionBlock in ms
  return (datumBlock);
}