'use strict';

var Promise = require('bluebird');

/**
 * flow.serial([func1, func2], callback)
 * ������� serial ��������� ������� � ������� ���������������.
 * ��������� ������� ���������� � ���������.
 * ������ ���������� ���������� �������, ��� �������� ������.
 * ������ ��������� ������ ���������� ������, � ������ � ������ ��� ��������� �������.
 * ���� ����� �� ������� �������� � ������ ������, �� ��������� �� �����������, � ���������� �������� ������ callback.
 */
exports.serial = function(functions, callback) {
    var functionIndex = 0;
    var nextCallback = function (error, data) {
        console.log("next serial");
        if (error || (functionIndex === functions.length - 1)) {
            callback(error, data);
        } else {
            functionIndex++;
            functions[functionIndex](data, nextCallback);
        }
    }

    var firstFunctionPromise = Promise.promisify(functions[0].bind(undefined, nextCallback));
    firstFunctionPromise()
        .then(function(data) {
            callback(null, data);
        })
        .catch(function (error, data) {
            callback(error, data);
        })
}

/**
 * flow.parallel([func1, func2], callback)
 * ������� parallel ��������� ������� � ������� �����������.
 * ��������� ���������� � ������, ������� ���������� � �������� ������ ��� ���������� ���� �������.
 * ������� ��������� ������. ������ ��������� ������ ���������� ������, � ������ � ������ ��� ��������� �������.
 */
exports.parallel = function (functions, callback) {
    console.log("start parallel")
    var nextCallback = function (error, data) {
        console.log('nextCallback parallel')
        if (error) {
            callback(error, data);
        }
    }

    var functionsPromises = functions.map(function(func) {
        return Promise.promisify(func.bind(undefined, nextCallback));
    });

    console.log("start all")
    functionsPromises[1]()
    //Promise.all(functionsPromises)
        .then(function(data) {
            console.log('then parallel')
            callback(null, data);
        })
        .catch(function(error) {
            console.log(error)
            callback(error, "");
        });
}

/**
 * flow.map(['value1', 'value2'], func, callback)
 * ������� map ��������� ������� � ������ ��������� �����������.
 * ������� ��������� �������� �� ������� � ������.
 * ��������� ���������� � ������, ������� ���������� � �������� ������ ��� ���������� ���� ��������.
 */
exports.map = function (params, func, callback) {
    console.log('start map');
    var nextCallback = function (error, data) {
        console.log('nextCallback map')
        console.log(data)
        if (error) {
            callback(error, data);
        }
    }

    var allPromise = params.map( function(parameter) {
        return Promise.promisify(func.bind(undefined, parameter, nextCallback));
    });

    //allPromise[0]()
    Promise.all(allPromise)
        .then(function(data) {
            console.log('start then map');
            callback(false, data);
            console.log('end then map')
        })
        .catch(function(error) {
            console.log('start catch map');
            callback(error, "");
        })
}