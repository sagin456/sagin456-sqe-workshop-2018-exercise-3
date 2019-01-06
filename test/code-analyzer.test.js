import assert from 'assert';
import {fix_cfg, parse_code} from '../src/js/code-analyzer';
import * as esgraph from 'esgraph/lib';
//import {parseCode} from '../src/js/code-analyzer';

function dema1(){
    let lidoi = 'function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}\n';
    let parsed_code = parse_code(lidoi);
    fix_cfg(esgraph(parsed_code.body[0].body)[2]);
    return null;
}

function dema2(){
    let lidoi = 'function foo(x, y, z){\n' +
        '   let a = x + 1;\n' +
        '   let b = a + y;\n' +
        '   let c = 0;\n' +
        '   \n' +
        '   while (a < 5) {\n' +
        '       c = a + b;\n' +
        '       z = c * 2;\n' +
        '       a++;\n' +
        '   }\n' +
        '   \n' +
        '   return z;\n' +
        '}\n';
    let parsed_code = parse_code(lidoi);
    fix_cfg(esgraph(parsed_code.body[0].body)[2]);
    return null;
}

function dema3(){
    return 3;
}

function dema4(){
    return 4;
}
function dema5(){
    return 5;
}
function dema6(){
    return 6;
}
function dema7(){
    return 7;
}
function dema8(){
    return 8;
}

function dema9(){
    return 9;
}
function dema10(){
    return 10;
}

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            null,
            dema1()
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            null,
            dema2()
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            3,
            dema3()
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            4,
            dema4()
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            5,
            dema5()
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            6,
            dema6()
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            7,
            dema7()
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            8,
            dema8()
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            9,
            dema9()
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            10,
            dema10()
        );
    });
});
