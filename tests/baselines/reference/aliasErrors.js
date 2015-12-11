//// [aliasErrors.ts]
module foo {    
    export class Provide {
    }
    export module bar { export module baz {export class boo {}}}
}

import provide = foo;
import booz = foo.bar.baz;
import beez = foo.bar;

import m = no;
import m2 = no.mod;
import n = 5;
import o = "s";
import q = null;
import r = undefined;


var p = new provide.Provide();

function use() {
    
  beez.baz.boo;
  var p1: provide.Provide; 
  var p2: foo.Provide;
  var p3:booz.bar;
  var p22 = new provide.Provide();
}



//// [aliasErrors.js]
var foo;
(function (foo) {
    var Provide = (function () {
        function Provide() {
        }
        return Provide;
    }());
    foo.Provide = Provide;
    var bar;
    (function (bar) {
        var baz;
        (function (baz) {
            var boo = (function () {
                function boo() {
                }
                return boo;
            }());
            baz.boo = boo;
        })(baz = bar.baz || (bar.baz = {}));
    })(bar = foo.bar || (foo.bar = {}));
})(foo || (foo = {}));
var provide = foo;
var booz = foo.bar.baz;
var beez = foo.bar;
5;
"s";
null;
var p = new provide.Provide();
function use() {
    beez.baz.boo;
    var p1;
    var p2;
    var p3;
    var p22 = new provide.Provide();
}
