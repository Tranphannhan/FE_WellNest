'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/Shadcn/breadcrumb';

import type { BreadcrumbProps } from 'antd'; // để dùng type `items`

interface Props {
  items: BreadcrumbProps['items'];
}

const BreadcrumbComponent: React.FC<Props> = ({ items }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !items) return null;

  return (
    <div style={{ position: 'absolute', top: -33, padding: '8px 0' }}>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isHighlighted = item.title === 'Trang chủ';

            const style = {
              color: isHighlighted ? '#1890ff' : '#888',
              fontWeight: isHighlighted ? 500 : 400,
              fontSize: 14,
              textDecoration: 'none',
            };

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href} style={style}>
                        {item.title}
                      </Link>
                    </BreadcrumbLink>
                  ) : isLast ? (
                    <BreadcrumbPage style={style}>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink style={style}>{item.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
