function linearRegression_R2(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    }

    return Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
}

function linearRegression_NV(y,x,k){
    var lr = {};
    var n = y.length-1;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    // Hier y.length -1, da die Regression nur mit den Werten n-1 gebildet werden soll
    // Es wird dennoch das volle array übergeben, da weiter unten der Zeit-Wert benötigt wird
    for (var i = 0; i < y.length-1; i++){

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    }

    var slope = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    var intercept = (sum_y - slope * sum_x)/n;

    console.log("SLOPE: " +  slope)
    console.log("inter: " +  intercept)
    console.log("x[k-1]: " +  x[k-1])
    

    return (intercept + slope * x[k-1]);
}

exports.validitaetspruefung = function (value,time,metrics) {
    console.log("values: " + value + "time: " + time)
    var alt_r2 = 0;
    var valide_typ = 0;
    var valide = 1;

    for(var i = 3; i <= value.length; i++){
        value_temporary = value.slice(0,i);
        time_temporary = time.slice(0,i);

        //console.log("ALGO Value: "+ value_temporary);
        //console.log("ALGO TIME: "+ time_temporary);

        r2 = linearRegression_R2(value_temporary,time_temporary);
        console.log("R2: " + r2);
        console.log("R2ALT: " + alt_r2);

        if(r2 > 0.7)
        {
            if(i > 3){
                var next_value = linearRegression_NV(value_temporary, time_temporary, i);
                if (next_value > value_temporary[i-1]){
                    if((r2 - alt_r2) < -0.01){
                    console.log("Ich bin in Möglichkeit 0");
                        for(var j = 2; j <= 4; j++){
                            if(metrics[i-j] == 9){
                                valide = 0;
                                console.log("Nicht valide an Stelle " + i);
                                console.log("Neuer Wert " + r2);
                                console.log("Alter Wert " + alt_r2);
                            }
                        }
                        valide_typ = 9;
                    }
                    else{
                    console.log("Ich bin in Möglichkeit 1");
                    valide = 1;
                    valide_typ = 1;
                    }
                }
                else if (next_value == value_temporary[i-1]){
                    console.log("Ich bin in Möglichkeit 2");
                    valide = 1;
                    valide_typ = 2;
                }
                else if (next_value < value_temporary[i-1]){
                    console.log("Ich bin in Möglichkeit 3");
                    valide = 1;
                    valide_typ = 3;
                }
            }
        }
        else{
            next_value = "No new value calculated as model is too bad"
            valide = 1;
            valide_typ = 0;
            console.log("Ich bin kleiner 0,7");
        }
        alt_r2 = r2;
       
    console.log("NV at Round " + i + ": " + next_value);
    console.log("RV at Round " + i + ": " + value_temporary[i-1]);
    }

    return [valide_typ, valide];
};
