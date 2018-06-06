let myRequest = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const h = 600
const w = 1200 
const p = 45

const colors = [
  {number: 0, color: "blue"},
  {number: 1, color: "#04007C"},
  {number: 2, color: "#0016A8"},
  {number: 3, color: "#0060CE"},
  {number: 4, color: "#3AA0FF"},
  {number: 5, color: "#9BE2FF"},
  {number: 6, color: "#EFEAD5"},
  {number: 7, color: "#DBB15E"},
  {number: 8, color: "#A8763E"},
  {number: 9, color: "#A8763E"},
  {number: 10, color: "#6F1A07"},
  {number: 11, color: "#540000"},
  {number: 12, color: "black"}
]

const svg = d3.select('body')
              .append('svg')
              .attr('id', 'heatmap-container')
              .attr('height', h)
              .attr('width', w)
              .style('padding', '30px')
            
const div = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0)
            
const xScale = d3.scaleLinear()
                 .domain([1752, 2016])
                 .range([p, w - p])
                
const yScale = d3.scaleLinear()
                 .domain([1, 13])
                 .range([p, h - p])
                 
                 
const colorScale = d3.scaleLinear()
                     .domain([-6.976, 5.228])
                     .range([1, 12])
                     
const xAxis = d3.axisBottom(xScale)

const yAxis = d3.axisLeft(yScale)


fetch(myRequest)
  .then(response => {
    if(response.status === 200) {
      return response.json()
    } else {
      throw new Error('oops')
    }
  })
  .then(response => {
    console.log(response)
    plot(response)
  })               

getColor = (variance) => {
  const scale = colorScale(variance)
  const trunc = Math.trunc(scale)
  const test = colors.filter(color => color.number === trunc)
  return test[0].color
}
// 
// console.log(getColor(4))

plot = (response) => {
                            
  svg.selectAll('rect')
    .data(response.monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d) => xScale(d.year))
    .attr('y', (d) => yScale(d.month))
    .attr('fill', (d) => { 
    
    })
    .attr('height', (d) => yScale(1))
    .attr('width', (d) => 5 )
    .attr("fill", (d) => getColor(d.variance))
    .on('mouseover', (d) => {
      div.transition()
         .duration(100)
         .style('opacity', .9)
      div.html(
        `${d.year}
         ${d.month}
         Variance: ${d.variance}
        `
      )
         .style('left', (d3.event.pageX) + 'px')
         .style('top', (d3.event.pageY) - 30 + 'px')  
    })
    .on('mouseout', (d) => {
      div.transition()
         .duration(100)
         .style('opacity', 0)
    })
    
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, '+ h + ')')
      .call(xAxis)
      
    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
}