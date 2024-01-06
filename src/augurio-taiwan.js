
function stacked_bar_chart(divname, data, categories, ymax, xname, width, height) {

  var margin = {top: 100, right: 1000, bottom: 100, left: 300};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

  d3.select(divname).select("svg").remove();

  var tooltip = d3
  .select(divname)
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  var svg = d3
  .select(divname)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .scale(mercatorScale)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3
  .scaleOrdinal()
  .domain(categories)
  .range(d3.schemeCategory10);

  var xScale = d3
  .scaleBand()
  .domain(data.map(d => d[xname]))
  .range([0, 1000])
  .padding(0.1);

  var yScale = d3
    .scaleLinear()
    .domain([0, ymax]) 
    .range([height, 0]);

    var stack = d3.stack().keys(categories); 
  var stackedData = stack(data);

  svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function(d) { 
          return colorScale(d.key); 
      })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { 
          return xScale(d.data[xname]); 
      })
      // y position
      .attr("y", function(d) { 
        var category = d3.select(this.parentNode).datum().key;
        var value = d.data[category]; 
        
        return yScale(d[1]); 
        
      })
      // height position
      .attr("height", function(d) { 
        // d[0] previous points height
        // d[1] current stack height

        var h = yScale(d[0]) - yScale(d[1])

        return (h); 
      
      })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function(d) {

        var category = d3.select(this.parentNode).datum().key;
       
        var value = d.data[category]; 

        var total = 0;
        for (var i = 0; i < categories.length; ++i)
            total += parseInt(d.data[categories[i]]);
        
        var proportion = value / total * 100.0;


        tooltip.html(d.data[xname] + "<br>" + category + " : " + value + "<br>" + "Proportion : " + proportion.toFixed(2) + "%")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .style("opacity", 1)
          .style("font-size", "52px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      });


  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text") 
    .style("text-anchor", "end") 
    .style("font-size", "22px")
    .attr("dx", "-0.5em")
    .attr("dy", "0.5em") 
    .style("transform", "rotate(-45deg)"); 


  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale))
    .selectAll("text") 
    .style("text-anchor", "end") 
    .style("font-size", "26px"); 


}

function pie_chart(divname, data, type, width, height) {

 

  var tooltip = d3
    .select(divname)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var color = d3.scale.ordinal()
    .domain(type)
    .range(d3.schemeCategory10);

  var radius = Math.min(width, height) / 2;
  var donutWidth = 80;
  var legendRectSize = 32;
  var legendSpacing = 4;


  
  var svg = d3.select(divname)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + ((width / 2)) +  ',' + ((height / 2)) + ')');
  

  var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.pie()
    .value(function(d) { return d.cnt; })
    .sort(null);

 svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr("class", "pie")
    .attr('d', arc)
    .attr('fill', function(d, i) { 
      return color(d.data.type); 
    })
    .attr("id", (d, i) => {return `pie-${i}`})
    .on("mouseover", function(d, i) {

      tooltip.html("級距(萬元): " + d.data["type"] + "<br>" + "納稅單位 : " + d.data["cnt"])
      .style("left", (d3.event.pageX + 30) + "px")
      .style("top", (d3.event.pageY - 150) + "px")
      .style("opacity", 1)
      .style("font-size", "14px");
      d3.selectAll(".pie")
          .style("fill-opacity", 0.2)
          .style("transition", "all 0.4s");
      d3.selectAll(`#pie-${i}`)
          .style("fill-opacity", 1)
          .style("transition", "all 0.4s");
      
      
    })
    .on("mousemove", function(d, i) {


      tooltip.html("級距(萬元): " + d.data["type"] + "<br>" + "納稅單位 : " + d.data["cnt"])
      .style("left", (d3.event.pageX + 30) + "px")
      .style("top", (d3.event.pageY - 150) + "px")
      .style("opacity", 1)
      .style("font-size", "50px");
      d3.selectAll(".pie")
          .style("fill-opacity", 0.2)
          .style("transition", "all 0.4s");
      d3.selectAll(`#pie-${i}`)
          .style("fill-opacity", 1)
          .style("transition", "all 0.4s");
      
      
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    })
    .on("mouseleave", function(d){
      d3.selectAll(".pie")
      .style("fill-opacity", 1)})

  var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function (d, i) {
    var offset = (legendRectSize + legendSpacing) * color.domain().length / 2,
      hor = -2 * legendRectSize;
    var vert = i * (legendRectSize + legendSpacing) - offset;
    return 'translate(' + hor + ',' + vert + ')';
  });

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color);

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function (d) { return d; })
  .style('font-size', '32px'); // Adjust the font size here

// Adjust rect position based on text size
legend.selectAll('rect')
  .attr('y', -legendRectSize / 2) // Center the rectangle vertically
  .attr('x', -(legendRectSize + legendSpacing)); // Adjust the rectangle position

// Adjust text position based on text size
legend.selectAll('text')
  .attr('y', 0) // Center the text vertically
  .attr('x', 0); // Adjust the text position

}


var categories_city = [
  '0', 
  '0 ~ 54', 
  '54 ~ 121', 
  '121 ~ 242', 
  '242 ~ 453', 
  '453 ~ 500', 
  '500 ~ 1000', 
  ' > 1000'
];

var categories_17_1 = [
  '營利所得',
  '執行業務所得',
  '薪資所得',
  '利息所得',
  '租賃及權利金',
  '財產交易所得',
  '機會中獎所得',
  '股利所得',
  '退職所得',
  '其他所得',
  '稿費所得',
  '申報大於歸戶',
];

var categories_16_1 = [
  '營利所得',
  '執行業務所得',
  '薪資所得',
  '利息所得',
  '租賃及權利金',
  '財產交易所得',
  '機會中獎所得',
  '股利所得'
]

function stack_16_1() {  
  $(".shop-list").hide();
  $(".taiwan-map").hide();
  $("#back").show();
  $("#sbc-click").hide();
  $("#sbc-figure2").hide();
  d3.csv("./src/16_1.csv", function(d) {

    d = d.slice(0, -1);
  
    d.sort(function(a, b) {
      return b["合 計"] - a["合 計"];
    });
  
    d.forEach(function(data) {
      delete data["納稅單位"];
      delete data["合 計"];
      delete data["薪資收入"];
  
    });

    stacked_bar_chart("#sbc-figure", d,  categories_16_1, 1094789841, "縣市別", 1500, 1000);
    $("#sbc-figure").show();
  });
}

function restore() {
  $(".shop-list").show();
  $(".taiwan-map").show();
  $("#sbc-figure").hide();
  $("#sbc-figure2").hide();
  $("#back").hide();
  $("#sbc-click").show();
  $("#sbc-click2").show();
}

function stack_17_1() {
  $(".shop-list").hide();
  $(".taiwan-map").hide();
  $("#back").show();
  $("#sbc-click2").hide();
  $("#sbc-figure").hide();
  d3.csv("./src/17_1.csv", function(d) {
  
    d = d.slice(0, -1);
  
    d.forEach(function(data) {
      delete data["納稅單位"];
      delete data["合 計"];
      delete data["薪資收入"];
  
    });

    stacked_bar_chart("#sbc-figure2", d, categories_17_1, 100, "縣市別", 1800, 2000);
    $("#sbc-figure2").show();
  });
}

function pie_city(divname, csvname) {

  d3.csv(csvname, function(d) {
  

    var testdata = [
      {type: '0', cnt: d[0]["納稅單位"]},
      {type: '0 ~ 54', cnt: d[1]["納稅單位"]},
      {type: '54 ~ 121', cnt: d[2]["納稅單位"]},
      {type: '121 ~ 242', cnt: d[3]["納稅單位"]},
      {type: '242 ~ 453', cnt: d[4]["納稅單位"]},
      {type: '453 ~ 500', cnt: d[5]["納稅單位"]},
      {type: '500 ~ 1000', cnt: d[6]["納稅單位"]},
      {type: ' > 1000', cnt: d[7]["納稅單位"]}
    ];
    pie_chart(divname, testdata, categories_city, 1000, 1000);
    
  });
}

function stack_city(divname, csvname) {

  d3.csv(csvname, function(d) {
    
   


    d = d.slice(0, -1);
    
    ymax = 0;

    d.forEach(function(data) {
      if (parseInt(data["合 計"]) > ymax)
        ymax = parseInt(data["合 計"]);
    })

    d.forEach(function(data) {
      delete data["納稅單位"];
      delete data["合 計"];
  
    });
  
    stacked_bar_chart(divname, d,  categories_16_1, ymax, "級距：萬元", 1500, 1000);
    
  });

}

const TaiwanMap = new Vue({
  el: '#app',
  data: {
    h1: '縣市中文',
    h2: '縣市英文'
  },
  methods: {
    async getTaiwanMap() {

      $("#back").hide();

      const width = (this.$refs.map.offsetWidth).toFixed(),
            height = (this.$refs.map.offsetHeight).toFixed();

      // 判斷螢幕寬度，給不同放大值
      let mercatorScale, w = window.screen.width;
      if(w > 1366) {
        mercatorScale = 11000;
      }
      else if(w <= 1366 && w > 480) {
        mercatorScale = 9000;
      }
      else {
        mercatorScale = 6000;
      }

      // d3：svg path 產生器
      var path = await d3.geo.path().projection(
        // !important 座標變換函式
        d3.geo
          .mercator()
          .center([121,24])
          .scale(mercatorScale)
          .translate([width/2, height/2.5])
      );
      
      // 讓d3抓svg，並寫入寬高
      var svg = await d3.select('#svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `0 0 ${width} ${height}`);
      
      // 讓d3抓GeoJSON檔，並寫入path的路徑
      var url = 'dist/taiwan.geojson';
      await d3.json(url, (error, geometry) => {
        if (error) throw error;
        /*
        svg
          .selectAll('path')
          .data(geometry.features)
          .enter().append('path')
          .attr('d', path)
          .attr({
            // 設定id，為了click時加class用
            id: (d) => 'city' + d.properties.COUNTYCODE
          })
          .on('click', d => {
            this.h1 = d.properties.COUNTYNAME; // 換中文名
            this.h2 = d.properties.COUNTYENG; // 換英文名
            console.log(d.properties.COUNTYENG);
            pie_chart("#pic", testdata, test_type);

            // 有 .active 存在，就移除 .active
            if(document.querySelector('.active')) {
              document.querySelector('.active').classList.remove('active');
            }
            // 被點擊的縣市加上 .active
            document.getElementById('city' + d.properties.COUNTYCODE).classList.add('active');
          });*/
          svg
          .selectAll('path')
          .data(geometry.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('id', (d) => 'city' + d.properties.COUNTYCODE)
          .attr('stroke', 'white') // Default stroke color
          .on('click', d => {
            this.h1 = d.properties.COUNTYNAME; // 換中文名
            this.h2 = d.properties.COUNTYENG; // 換英文名

            d3.select('#div1').selectAll('svg').remove();
            d3.select('#div2').selectAll('svg').remove();

            pie_city("#div1", "./csv/" + d.properties.CSVNAME);

            stack_city("#div2", "./csv/" + d.properties.CSVNAME);

            if(document.querySelector('.active')) {
              const clickedElement =document.querySelector('.active');
              document.querySelector('.active').classList.remove('active');
              clickedElement.style.fill = 'white';
            }
            // // 被點擊的縣市加上 .active
            // document.getElementById('city' + d.properties.COUNTYCODE).classList.add('active');
            // document.querySelector('.active').classList.style('fill','red');
            const clickedElement = document.getElementById('city' + d.properties.COUNTYCODE);
            clickedElement.classList.add('active');

            // Set the fill color of the clicked path
            clickedElement.style.fill = 'red';
          });
      });
      return svg;
    },
  },
  mounted() {

    this.getTaiwanMap();

  }
})