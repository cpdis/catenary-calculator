import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Paper, Box, IconButton, Tooltip } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useSettings } from '../contexts/SettingsContext';

const CatenaryVisualization = React.forwardRef(({ results, width = 800, height = 500 }, ref) => {
  const { settings } = useSettings();
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!results || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create main group with margin
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate points for the catenary curve
    const { anchorDistance, waterDepth } = results;
    const points = generateCatenaryPoints(results);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, anchorDistance])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, waterDepth])
      .range([0, innerHeight]);

    // Create zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(event.transform);
      });

    svg.call(zoomBehavior);
    setZoom(d3.zoomIdentity);

    // Create axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    // Add axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Add axis labels
    g.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 5)
      .text('Distance (m)');

    g.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .text('Depth (m)');

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveNatural);

    // Draw seabed
    g.append('line')
      .attr('class', 'seabed')
      .attr('x1', 0)
      .attr('y1', yScale(waterDepth))
      .attr('x2', innerWidth)
      .attr('y2', yScale(waterDepth))
      .attr('stroke', settings.visualization.theme === 'dark' ? '#8b4513' : '#8b4513')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Draw water surface
    g.append('line')
      .attr('class', 'water-surface')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', innerWidth)
      .attr('y2', 0)
      .attr('stroke', settings.visualization.theme === 'dark' ? '#0077be' : '#0077be')
      .attr('stroke-width', 1);

    // Draw catenary curve
    const path = g.append('path')
      .datum(points)
      .attr('class', 'catenary-line')
      .attr('fill', 'none')
      .attr('stroke', settings.visualization.theme === 'dark' ? '#2196f3' : '#2196f3')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add fairlead and anchor points
    const fairlead = g.append('circle')
      .attr('class', 'fairlead-point')
      .attr('cx', xScale(0))
      .attr('cy', yScale(0))
      .attr('r', 5)
      .attr('fill', settings.visualization.theme === 'dark' ? '#f44336' : '#f44336');

    const anchor = g.append('circle')
      .attr('class', 'anchor-point')
      .attr('cx', xScale(anchorDistance))
      .attr('cy', yScale(waterDepth))
      .attr('r', 5)
      .attr('fill', settings.visualization.theme === 'dark' ? '#4caf50' : '#4caf50');

    // Add tooltips for points
    const fairleadTooltip = g.append('text')
      .attr('x', xScale(0) + 10)
      .attr('y', yScale(0))
      .text('Fairlead')
      .attr('font-size', '12px')
      .attr('fill', settings.visualization.theme === 'dark' ? '#666' : '#666');

    const anchorTooltip = g.append('text')
      .attr('x', xScale(anchorDistance) - 40)
      .attr('y', yScale(waterDepth) - 10)
      .text('Anchor')
      .attr('font-size', '12px')
      .attr('fill', settings.visualization.theme === 'dark' ? '#666' : '#666');

    // Add hover effect for the line
    const hoverLine = g.append('line')
      .attr('class', 'hover-line')
      .attr('stroke', settings.visualization.theme === 'dark' ? '#999' : '#999')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .style('display', 'none');

    const hoverPoint = g.append('circle')
      .attr('class', 'hover-point')
      .attr('r', 4)
      .attr('fill', settings.visualization.theme === 'dark' ? '#666' : '#666')
      .style('display', 'none');

    const hoverText = g.append('text')
      .attr('class', 'hover-text')
      .attr('font-size', '12px')
      .style('display', 'none');

    // Add hover interaction
    svg.on('mousemove', (event) => {
      const [mouseX, mouseY] = d3.pointer(event);
      const x = xScale.invert(mouseX - margin.left);
      const y = yScale.invert(mouseY - margin.top);

      if (x >= 0 && x <= anchorDistance && y >= 0 && y <= waterDepth) {
        const bisect = d3.bisector(d => d[0]).left;
        const index = bisect(points, x);
        const point = points[index];

        if (point) {
          hoverLine
            .style('display', null)
            .attr('x1', xScale(point[0]))
            .attr('y1', 0)
            .attr('x2', xScale(point[0]))
            .attr('y2', yScale(waterDepth));

          hoverPoint
            .style('display', null)
            .attr('cx', xScale(point[0]))
            .attr('cy', yScale(point[1]));

          hoverText
            .style('display', null)
            .attr('x', xScale(point[0]) + 10)
            .attr('y', yScale(point[1]) - 10)
            .text(`Distance: ${point[0].toFixed(1)}m, Depth: ${point[1].toFixed(1)}m`);
        }
      } else {
        hoverLine.style('display', 'none');
        hoverPoint.style('display', 'none');
        hoverText.style('display', 'none');
      }
    });

    svg.on('mouseleave', () => {
      hoverLine.style('display', 'none');
      hoverPoint.style('display', 'none');
      hoverText.style('display', 'none');
    });

    // Add styles
    svg.selectAll('.domain').attr('stroke', settings.visualization.theme === 'dark' ? '#ccc' : '#ccc');
    svg.selectAll('.tick line').attr('stroke', settings.visualization.theme === 'dark' ? '#ccc' : '#ccc');
    svg.selectAll('.tick text').attr('fill', settings.visualization.theme === 'dark' ? '#666' : '#666');

  }, [results, width, height, settings.visualization]);

  const handleZoomIn = () => {
    if (!zoom) return;
    const svg = d3.select(svgRef.current);
    const transform = d3.zoomIdentity
      .translate(zoom.x, zoom.y)
      .scale(zoom.k * 1.2);
    svg.transition().duration(300).call(d3.zoom().transform, transform);
  };

  const handleZoomOut = () => {
    if (!zoom) return;
    const svg = d3.select(svgRef.current);
    const transform = d3.zoomIdentity
      .translate(zoom.x, zoom.y)
      .scale(zoom.k / 1.2);
    svg.transition().duration(300).call(d3.zoom().transform, transform);
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(d3.zoom().transform, d3.zoomIdentity);
  };

  if (!results) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }} ref={ref}>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton onClick={handleReset} size="small">
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <svg ref={svgRef} style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    </Paper>
  );
};

// Helper function to generate points for the catenary curve
const generateCatenaryPoints = (results) => {
  const { anchorDistance, waterDepth, fairleadAngle, anchorAngle } = results;
  const points = [];
  const numPoints = 100;

  // Generate points using a parametric approach
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = t * anchorDistance;
    
    // Use a modified catenary equation that respects the fairlead and anchor angles
    const a = waterDepth / (Math.cosh(anchorDistance / 2) - 1);
    const y = a * (Math.cosh(x - anchorDistance / 2) - Math.cosh(-anchorDistance / 2));
    
    points.push([x, y]);
  }

  return points;
};

export default CatenaryVisualization;
