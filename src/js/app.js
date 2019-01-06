import $ from 'jquery';
import {parse_code, fix_cfg} from './code-analyzer';
import * as esgraph from 'esgraph';
import Viz from 'viz.js';
import {Module, render} from 'viz.js/full.render';
import {color_path} from './graph_coloring';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let code_to_parse = $('#codePlaceholder').val();
        let parameters_to_parse = $('#argumentsPlaceholder').val();

        let parsed_code = parse_code(code_to_parse);
        let parameter_values = eval('[' + parameters_to_parse + ']');
        let cfg = esgraph(parsed_code.body[0].body);
        cfg[2] = fix_cfg(cfg[2]);
        color_path(cfg[2], parsed_code, parameter_values);
        let dot = esgraph.dot(cfg, {counter: 0, source: parsed_code.body[0].body});
        dot = my_dot(dot, cfg[2]);
        show_dot(dot);

    });
});


function show_dot(dot){
    let graph = document.getElementById('cfg');
    var viz = new Viz({ Module, render });
    viz.renderSVGElement('digraph G {' + dot + '}')
        .then(function(element) {
            graph.innerHTML = '';
            graph.append(element);
        });
}


function my_dot(dot, cfg){
    dot = dot.split('\n');
    let count = 0;
    cfg.forEach((node, i) => {
        let color = node.colored? '#01FF70' : 'white';
        add_if_while(node);
        remove_let(node);
        if (node.skip) {
            dot[i] = 'n' + i + ' [label="' + node.code
                + '", shape="' + node.shape + '", fillcolor="' + color + '", style="filled"]';            
        }
        else {
            count = count+1;
            dot[i] = 'n' + i + ' [label="(' + count + ')\n' + node.code
                + '", shape="' + node.shape + '", fillcolor="' + color + '", style="filled"]';
        }
    });
    return dot.join('\n');
}

function add_if_while (node) {
    if (node.parent.type === 'IfStatement') {
        node.code = 'if (' + node.code + ')';
    }
    else if (node.parent.type === 'WhileStatement') {
        node.code = node.skip? '' : 'while (' + node.code + ')';
    }
}

function remove_let(node) {
    node.code = node.code.split('\n').map(line => {
        if (line.startsWith('let ')){
            line = line.slice(4);
        }
        return line;
    }).join('\n');
    return node;
}

