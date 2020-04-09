const Emmiter = require('events');

const currentData = {
    emitter: new Emmiter(),
    data: {"version": "1.1",
        "timestamp": 0,
        "positions": [{
            "type": "bus",
            "number": "10",
            "gps_id": "1",
            "lat": 0.0,
            "lng": 0.0,
            "timestamp": 0,
            "suburban": "true",
            "bort_number": "AX2576HB",
            "speed": 0,
            "azimut": "-1",
            "handicapped": "false",
            "wifi": "false"
        }],
    },
    setData: function (obj)  {
        this.data.timestamp = new Date(Date.now()).getUnixTime();
        this.data.positions[0]["timestamp"] = obj["timestamp"];
        this.data.positions[0]["lat"] = this.correctNumberPositon(obj["lat"]);
        this.data.positions[0]["lng"] = this.correctNumberPositon(obj["lng"]);
        process.stdout.write('\033c');
        console.log(this.data);
        this.emitter.emit("updateData");
    },
    getData: function () {
        return JSON.stringify(this.data)
    },
    correctNumberPositon: function (number) {
        let arr = number.toString().split('');
        let result;
        arr.splice(2, 0, '.');
        result = parseFloat(arr.join(''));
        return result
    }

};
currentData.emitter.addListener('updateData', () => {
    process.stdout.write('\033c');
    console.log(Date.now())
    console.log(currentData.getData())
});

module.exports = currentData;