export const KunaiLogo = ({
  width = 200,
  height = 85,
}: {
  width?: number;
  height?: number;
}) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-32 h-32"
    >
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="2"
          dy="2"
          stdDeviation="3"
          flood-color="#333333"
          flood-opacity="0.3"
        />
      </filter>
      <g filter="url(#shadow)" transform="translate(24 14)">
        <path
          d="M0 49.7437C0 37.8131 24.3559 33.1154 37.3081 26.1326C56.6701 15.6933 73.451 -1.2683 81.4502 6.5217C91.0218 15.8382 68.6915 37.6423 68.6915 49.6563C68.6915 61.6699 91.0218 83.474 81.4502 92.7904C73.451 100.5805 56.6701 83.6186 37.3081 73.1791C24.3559 66.1965 0 61.4988 0 49.5684V49.7437Z"
          fill="#E85A51"
        />
        <path
          d="M19.8643 10.7988L58.8037 49.7003L19.8643 88.6023V10.7988ZM15.386 0V99.41L65.1399 49.7047L15.386 0Z"
          fill="#fff"
          class="transition-[fill] duration-[500ms] group-data-[mobile-nav]:fill-[#2F3652]"
        />
      </g>
    </svg>
);