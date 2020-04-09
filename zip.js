'use strict';

const zlib = require('zlib');
const logger = require('./logger.js')('./logs/zip.log')()('app')('zip');
const info = logger('info');
const errorf = logger('error');
const currentData = require('./currentData.js');
const Emmiter = require('events');

const zipData = {
    buffData: Buffer.from('','utf-8'),
    emitter: new Emmiter(),
    setZipData: function (data)  {
        zlib.gzip(data, (error, compressData)=>{
            if (error) {
                errorf(error);
            }else{
                this.buffData = compressData;
                // info('create gzip data');
                this.emitter.emit("update", this.getZipData());
            }
        })
    },
    getZipData: function () {
        return this.buffData
    }
};

currentData.emitter.addListener("updateData", () => {
    zipData.setZipData(currentData.getData())
})


module.exports = zipData