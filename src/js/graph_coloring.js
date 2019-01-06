import {parse_code} from './code-analyzer';

const statement_handler = {
    'VariableDeclaration' : var_declare,
    'UpdateExpression': update_expr,
    'Program': sequence,
    'MemberExpression': mem_expr,
    'LogicalExpression': bin_expr,
    'Literal': literal,
    'Identifier': identifier,
    'FunctionDeclaration': fun_declare,
    'ExpressionStatement': expr_statement,
    'BlockStatement': sequence,
    'BinaryExpression': bin_expr,
    'AssignmentExpression': assign_expr,
    'ArrayExpression': arr_expr,
};

function exp_eval(exp, env) {
    return statement_handler[exp.type](exp, env);
}

function sequence(exp, env) {
    exp.body.forEach(e => exp_eval(e, env));
}

function assign_expr(exp, env) {
    let right = exp_eval(exp.right, env);
    let left = exp.left;
    if (left.type === 'Identifier'){
        env[exp.left.name] = right;
    }
    else { // For array
        let val = env[left.object.name];
        let members = val.slice(1, val.length - 1).split(',');        
        members[left.property.value] = right;
        env[left.object.name] = '[' + members.join(',') + ']';
    }
    return true;
}

function expr_statement(exp, env) {
    return exp_eval(exp.expression, env);
}

function fun_declare() {
    //empty
}

function var_declare(exp, env) {
    exp.declarations.forEach(e => env[e.id.name] = exp_eval(e.init, env));
    return true;
}

function bin_expr(exp, env) {
    let left = exp_eval(exp.left, env);
    let right = exp_eval(exp.right, env);
    return eval(left + exp.operator + right);
}

function update_expr(exp, env) {
    let syntactic_sugar = exp.argument.name + ' = ' + exp.argument.name + exp.operator[0] + ' 1;';
    let parsed = parse_code(syntactic_sugar);
    exp_eval(parsed, env);
    return eval(env[parsed.name]);
}

function identifier(exp, env) {
    return env[exp.name];
}

function literal(exp) {
    return exp.raw;
}

function mem_expr(exp, env) {
    let object = exp_eval(exp.object, env);
    let property = exp_eval(exp.property, env);
    return eval(object + '[' + property + ']');
}

function arr_expr(exp, env){
    return '[' + exp.elements.map(e => exp_eval(e, env)).join(', ') + ']';
}

function color_path (cfg, parsedCode, params) {
    let node = cfg[0];
    let env = init_env(parsedCode, params);
    exp_eval(parsedCode, env);
    while (node.astNode.type !== 'ReturnStatement'){
        node.colored = true;
        if (node.normal){
            exp_eval(parse_code(node.code), env);
            node = node.normal;
        }
        else if (exp_eval(parse_code(node.code).body[0], env))
            node = node.true;
        else
            node = node.false;
    }
    node.colored = true;
}

function init_env(parsed_code, param_values) {
    let env = {};
    parsed_code.body[0].params.forEach((param, i) => {
        env[param.name] = param_values[i];
    });
    return env;
}

export {color_path};
