export default function LoadingSpinner(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-ping"
      >
        <path
          d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14ZM2.66728 14C2.66728 20.2589 7.74111 25.3327 14 25.3327C20.2589 25.3327 25.3327 20.2589 25.3327 14C25.3327 7.74111 20.2589 2.66728 14 2.66728C7.74111 2.66728 2.66728 7.74111 2.66728 14Z"
          fill="white"
        />
      </svg>
    );
  }
  