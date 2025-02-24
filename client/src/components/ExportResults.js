import React, { useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportResults = ({ results, visualizationRef, resultsRef }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Helper function to format date for filenames
  const getFormattedDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Helper function to create results data object
  const getResultsData = () => {
    const {
      fairleadAngle,
      groundedLength,
      anchorDistance,
      anchorAngle,
      anchorTension,
      safetyFactor,
      inputValues
    } = results;

    return {
      'Calculation Results': {
        'Fairlead Angle (degrees)': fairleadAngle.toFixed(2),
        'Grounded Length (m)': groundedLength.toFixed(2),
        'Anchor Distance (m)': anchorDistance.toFixed(2),
        'Anchor Angle (degrees)': anchorAngle.toFixed(2),
        'Anchor Tension (N)': anchorTension.toFixed(2),
        'Safety Factor': safetyFactor.toFixed(3)
      },
      'Input Parameters': {
        'Component Type': inputValues.componentType,
        'Component Size': inputValues.componentSize,
        'Component Length (m)': inputValues.componentLength,
        'Water Depth (m)': inputValues.waterDepth,
        'Weight (kg/m)': inputValues.componentWeight,
        'Stiffness (N/m²)': inputValues.componentStiffness,
        'MBL (N)': inputValues.componentMBL,
        'Fairlead Tension (N)': inputValues.fairleadTension
      }
    };
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      handleClose();

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      // Add title
      pdf.setFontSize(16);
      pdf.text('Catenary Calculator Results', pageWidth / 2, margin, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, margin + 10);

      // Capture and add visualization
      if (visualizationRef.current) {
        const canvas = await html2canvas(visualizationRef.current);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', margin, margin + 20, imgWidth, imgHeight);
      }

      // Add numerical results
      const resultsData = getResultsData();
      let yPos = margin + 120;

      Object.entries(resultsData).forEach(([section, data]) => {
        pdf.setFontSize(14);
        pdf.text(section, margin, yPos);
        yPos += 10;

        pdf.setFontSize(12);
        Object.entries(data).forEach(([key, value]) => {
          if (yPos > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.text(`${key}: ${value}`, margin, yPos);
          yPos += 7;
        });
        yPos += 10;
      });

      // Save the PDF
      pdf.save(`catenary-results-${getFormattedDate()}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      setIsExporting(true);
      handleClose();

      const resultsData = getResultsData();
      const wb = XLSX.utils.book_new();

      // Convert data to worksheet format
      const wsData = [];
      Object.entries(resultsData).forEach(([section, data]) => {
        wsData.push([section]);
        wsData.push([]);
        Object.entries(data).forEach(([key, value]) => {
          wsData.push([key, value]);
        });
        wsData.push([]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Catenary Results');

      // Save the file
      XLSX.writeFile(wb, `catenary-results-${getFormattedDate()}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      setIsExporting(true);
      handleClose();

      const resultsData = getResultsData();
      let csvContent = '';

      // Convert data to CSV format
      Object.entries(resultsData).forEach(([section, data]) => {
        csvContent += `${section}\n\n`;
        Object.entries(data).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`;
        });
        csvContent += '\n';
      });

      // Create and save the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `catenary-results-${getFormattedDate()}.csv`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!results) return null;

  return (
    <>
      <ButtonGroup variant="contained" size="small" sx={{ mt: 2 }}>
        <Tooltip title="Export to PDF">
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
          >
            PDF
          </Button>
        </Tooltip>
        <Tooltip title="Export to Excel">
          <Button
            onClick={exportToExcel}
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} /> : <TableViewIcon />}
          >
            Excel
          </Button>
        </Tooltip>
        <Tooltip title="More Options">
          <Button
            onClick={handleClick}
            disabled={isExporting}
            aria-controls={menuOpen ? 'export-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <MoreVertIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={exportToCSV} disabled={isExporting}>
          Export to CSV
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportResults;
