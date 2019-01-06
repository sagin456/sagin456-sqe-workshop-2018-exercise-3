import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parse_code = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

function fix_cfg(cfg){
    cfg = remove_exceptions_edges(cfg);
    cfg = remove_entry_node(cfg);
    cfg = remove_exit_node(cfg);
    cfg = explicit_code(cfg);
    cfg = merge_blocks(cfg);
    cfg = shape_match(cfg);
    cfg = out_of_block(cfg);
    return cfg;
}

function out_of_block(cfg) {
    cfg.forEach((node, i) => {
        if (node.prev.length <= 1) return;
        let new_node = Object.assign({}, node);
        node.code = '';
        node.skip = true;
        node.normal = new_node;
        node.next = [new_node];
        node.shape = 'rectangle';
        node.false = undefined;
        node.true = undefined;
        node.astNode = false;
        new_node.prev = [node];
        cfg.splice(i+1, 0, new_node);
    });
    return cfg;
}

function shape_match(cfg) {
    return cfg.map(node => {
        if (node.parent.type === 'WhileStatement') {
            node.shape = 'ellipse';
        }
        else if (node.true) {
            node.shape = 'diamond';
        }
        return node;
    });
}


function remove_exceptions_edges (cfg) {
    for (let inner_cfg of cfg) {
        delete inner_cfg['exception'];
    }
    return cfg;
}

function remove_entry_node(cfg){
    cfg.splice(0,1);
    return cfg;
}

function explicit_code(cfg){
    return cfg.map(node => {
        node.code = escodegen.generate(node.astNode).split('\n').join('');
        return node;
    });
}

function merge_blocks(cfg){
    cfg.forEach(node => {
        if (node.next.length !== 1 || node.merged) return;
        let merged_node = node;
        node = node.next[0];
        while (node.next.length == 1) {
            //if (node.prev.length <= 1) {
            merged_node.next = node.next;
            merged_node.normal = node.normal;
            merged_node.code = merged_node.code + '\n' + node.code;
            cfg = cfg.filter(node1 => node1 !== node);
            //} else {
            //    break;
            //}
            node.merged = true;
            node = node.next[0];
        }
    });
    return cfg;
}




function remove_exit_node(cfg){
    let exit_node = cfg[cfg.length-1];
    for (let prev of exit_node.prev) {
        if(prev.normal === exit_node)
            delete prev['normal'];
        prev.next = prev.next.filter(node => node !== exit_node);
    }
    cfg.splice(cfg.length-1,1);
    return cfg;
}



export {parse_code};
export {fix_cfg};