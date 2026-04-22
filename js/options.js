import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        m1_pairs: 2,
        m1_difficulty: 'normal',
        m1_groupSize: 2,
        m2_difficulty: 'normal',
        m2_groupSize: 2
    } 

    var m1_pairs = $('#m1-pairs');
    var m1_difficulty = $('#m1-dif');
    var m1_groupSize = $('#m1-groupSize');
    

    var m2_difficulty = $('#m2-dif');
    var m2_groupSize = $('#m2-groupSize');
    
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var config = Object.assign({}, default_options, savedOptions);


    m1_pairs.val(config.m1_pairs);
    m1_difficulty.val(config.m1_difficulty);
    m1_groupSize.val(config.m1_groupSize);
    m2_difficulty.val(config.m2_difficulty);
    m2_groupSize.val(config.m2_groupSize);

    m1_pairs.on('change', function (){
        config.m1_pairs = m1_pairs.val();
    });

    m1_difficulty.on('change', function (){
        config.m1_difficulty = m1_difficulty.val();
    });

    m1_groupSize.on('change', function (){
        config.m1_groupSize = m1_groupSize.val();
    });

    m2_difficulty.on('change', function() {
         config.m2_difficulty = m2_difficulty.val(); 
    });

    m2_groupSize.on('change', function() {
         config.m2_groupSize = m2_groupSize.val(); 
    });

    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(config);
        },
        defaultValues: function(){
            Object.assign(config, default_options);
            m1_pairs.val(config.m1_pairs);
            m1_difficulty.val(config.m1_difficulty);
            m1_groupSize.val(config.m1_groupSize);
            m2_difficulty.val(config.m2_difficulty);
            m2_groupSize.val(config.m2_groupSize);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
