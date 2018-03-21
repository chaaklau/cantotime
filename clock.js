const cardinal_char = ['{twelve}十二(sap6-ji6)','{one}一(jat1)','{two}兩(loeng5)','{three}三(saam1)','{four}四(sei3)','{five}五(ng5)','{six}六(luk6)','{seven}七(cat1)','{eight}八(baat3)','{nine}九(gau2)','{ten}十(sap6)','{eleven}十一(sap6-jat1)','{twelve}十二(sap6-ji6)' ];
const ordinal_char = ['{on the hour}正(zing3)','{one}一(jat1)','{two}二(ji6)','{three}三(saam1)','{four}四(sei3)','{five}五(ng5)','{half}半(bun3)','{seven}七(cat1)','{eight}八(baat3)','{nine}九(gau2)','{ten}十(sap6)','{eleven}十一(sap6-jat1)',''];
const h_word = '{hour}點(dim2)'; //added after the hour
const w_pref_word = '{step}沓(daap6)'; //optionally added before the word (zi6)
const w_suff_word = '{word}個字(go3 zi6)'; //
const half_word = '{halfway past}個半字(go3 bun3 zi6)';
const over_word = '{a little past}過啲(gwo3-di1)'; //added if minute remainder is 1,2
const exact_word = '{on the hour}正(zing3)'; //added for exact o'clock
const almost_word = '{almost}就嚟(zau6-lai4)'; //added to the front if minute remainder is 4
const is_word = '{is}係(hai6)'; //added to all other minute remainder other than 4
const now_word = '{now}而家(ji4-gaa1)';
function getTime() {
  //getTime() returns the time in the [h:z:r] format
  //Cantonese clock is divded into
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  return [h, Math.floor(m / 5), m % 5, s];
}

String.prototype.makeruby = function() {
  return '<ruby>' + this.replace('{', '<span title="').replace('}', '">').replace('(','</span><rt>').replace(')','</rt>') + '</ruby>';
}

function hzr2canto(hzr) {
  var h = hzr[0] - (hzr[0]> 11 ? 12 : 0) ;
  var z = hzr[1];
  var r = hzr[2];
  var s = hzr[3];

  var exact = r==0;
  var over = r==1 || (z==0 && (r==2 || r==3 && s < 30));
  var half = z!=0 && ( r==2 || r==3 && s < 30 );
  var almost = r==4 || (r==3 && s >= 30);
  
  //If it is one minute to the next clear-cut unit, say 'almost', and then round up
  if (almost) {
    r = 0;
    if (++z == 12) { ++h; }
  }
  
  //If it is 1-2 min. past an exact time, set r to 0 and add a suffix
  if (over) {
    r = 0;
  }

  var halfpast = z==6 && r==0;
  var oclock = r==0 && z==0;
  var str = '';
    str += now_word.makeruby();
    str += (almost ? almost_word.makeruby() : is_word.makeruby()) ;  //Say almost if it's 1 min to sth
    str += cardinal_char[h].makeruby() + h_word.makeruby();  //the hour 
    str += (exact && !halfpast && !oclock ? w_pref_word.makeruby() : '');  //use the daap6 prefix if it is not half-past
    str += (half ? cardinal_char[z].makeruby() + half_word.makeruby() : (oclock ? '' : ordinal_char[z].makeruby()));  //if half, use -go3bun3zi6
    str += (over ? over_word.makeruby() : (oclock ? exact_word.makeruby() : '') ); //gwo3-di1 if it's 1 or 2 min past
  return str;
}
