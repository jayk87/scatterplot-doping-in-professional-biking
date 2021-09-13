var width = 800,
height = 400,
padding = 75,
r = 4;

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').
then(response => response.json()).
then(data => {
  var legend = ['Times with doping allegations', 'No doping allegatios'];
  const parseTime = d3.timeParse('%M:%S');
  // console.log(legend[0])

  const xScale = d3.scaleLinear().
  domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1]).
  range([0, width]);

  const yScale = d3.scaleTime().
  domain([d3.min(data, d => parseTime(d.Time)), d3.max(data, d => parseTime(d.Time))]).
  range([0, height]);

  const svg = d3.select('#chart').
  append('svg').
  attr('width', width + 2 * padding).
  attr('height', height + 2 * padding).
  style('fill', 'black').
  style('background-color', '#F0F8FF');

  const tooltip = d3.select('#chart').
  append('div').
  style("visibility", "hidden").
  style('position', 'absolute').
  attr('id', 'tooltip').
  style('background-color', 'white').
  style('opacity', '.8').
  style('padding', '3px');
  svg.append('text').
  attr('id', 'title').
  attr('x', (width + 2 * padding) / 2).
  attr('y', padding / 2).
  attr('text-anchor', 'middle').
  attr('font-size', '25px').
  text('Doping in Professional Bicycle Racing');

  svg.append('text').
  attr('id', 'title').
  attr('x', (width + 2 * padding) / 2).
  attr('y', padding - 8).
  attr('text-anchor', 'middle').
  attr('font-size', '20px').
  text("Top 25 Times Up Alpe d'Huez");

  svg.selectAll('circle').
  data(data).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('r', r).
  attr('cx', d => xScale(d.Year) + padding).
  attr('cy', d => yScale(parseTime(d.Time)) + padding).
  attr('data-xvalue', d => d.Year).
  attr('data-yvalue', d => parseTime(d.Time)).
  attr('stroke', 'black').
  attr('fill', d => d.Doping == "" ? '#1E90FF' : '#DC143C').
  on('mouseover', (d, i) => {
    return (
      tooltip.style('visibility', 'visible').
      html(i.Name + ' from ' + i.Nationality + '<br>Time: ' + i.Time + ' in ' + i.Year + '<br>' + (i.Doping == '' ? '' : 'Allegation: ' + i.Doping)).

      style('left', event.pageX + 15 + 'px').
      style('top', event.pageY - 40 + 'px').
      attr('data-year', i.Year)
      //         "Time": "36:55",
      // "Place": 2,
      // "Seconds": 2215,
      // "Name": "Marco Pantani",
      // "Year": 1997,
      // "Nationality": "ITA",
      // "Doping": "Alleged drug use during 1997 due to high hermatocrit levels",
      // "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
    );
  }).
  on('mouseout', () => {
    tooltip.style("visibility", 'hidden');
  });


  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).
  tickFormat(d3.timeFormat('%M:%S'));



  svg.append('g').
  attr('transform', 'translate(' + padding + ',' + (height + padding) + ')').
  attr('id', 'x-axis').
  call(xAxis);

  svg.append('g').
  attr('transform', 'translate(' + padding + ',' + padding + ')').
  attr('id', 'y-axis').
  call(yAxis);

  svg.selectAll('mydots').
  data(legend).
  enter().
  append('circle').
  attr('cx', width - 130).
  attr('cy', (d, i) => 200 + i * 20).
  attr('r', 6).
  attr('fill', d => d == 'No doping allegatios' ? '#1E90FF' : '#DC143C').
  attr('stroke', 'black');

  svg.selectAll('mylabels').
  data(legend).
  enter().
  append('text').
  attr('id', 'legend').
  attr('x', width - 120).
  attr('y', (d, i) => 205 + i * 20).
  text(d => d);


});