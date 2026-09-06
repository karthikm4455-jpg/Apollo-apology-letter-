import React from 'react';

interface ApolloLogoProps {
  className?: string;
  height?: number | string;
  showTextLabels?: boolean;
}

export const ApolloLogo: React.FC<ApolloLogoProps> = ({
  className = 'h-10 w-auto',
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/apollo-logo.svg"
        alt="Apollo Pharmacy + Apollo 24|7"
        className="h-full w-auto object-contain"
        loading="eager"
      />
    </div>
  );
};

export default ApolloLogo;
