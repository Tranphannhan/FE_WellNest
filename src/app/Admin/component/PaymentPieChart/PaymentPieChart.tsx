'use client';
import React from 'react';
import { ResponsivePie, ComputedDatum } from '@nivo/pie';
import { Typography } from '@mui/material';

interface PaymentPieChartProps {
  title: string;
  data: { id: string; label: string; value: number; color: string }[];
  total: number;
}

const PaymentPieChart: React.FC<PaymentPieChartProps> = ({ title, data, total }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: '38%',
          borderLeft: '1px solid rgb(172, 172, 172) !important',
          position: 'relative',
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
          {title}: Không có dữ liệu
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '38%',
        borderLeft: '1px solid rgb(172, 172, 172) !important',
        position: 'relative',
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}
      >
        {title}
      </Typography>
      <div
        style={{
          width: '100%',
          height: 300,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 0, bottom: 80, left: 0 }}
          innerRadius={0.6}
          padAngle={1}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          enableArcLinkLabels={true}
          arcLabelsComponent={({ }: { datum: ComputedDatum<{ id: string; label: string; value: number; color: string }> }) => (
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                fill: 'none',
              }}
            >
              {/* Không render text label trong từng arc */}
            </text>
          )}
          tooltip={({ datum }: { datum: ComputedDatum<{ id: string; label: string; value: number; color: string }> }) => (
            <div
              style={{
                background: '#a3c2c2',
                padding: '9px 12px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontSize: '14px',
                width: '200px',
              }}
            >
              <strong>{datum.label}</strong>: {datum.value} Đơn
            </div>
          )}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 20,
              itemWidth: 100,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '18px',
            textAlign: 'center',
          }}
        >
          {`${total} Đơn`}
        </Typography>
      </div>
    </div>
  );
};

export default PaymentPieChart;