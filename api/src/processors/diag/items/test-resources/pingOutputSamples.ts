export const PING_OK_SAMPLE_UNEXPECTED = 
  ``;

export const PING_OK_SAMPLE_100_LOSS =
  `PING localhost(localhost (::1)) 56 data bytes

--- localhost ping statistics ---
4 packets transmitted, 0 received, 100% packet loss, time 1029ms
rtt min/avg/max/mdev = 0/0/0/0 ms
`;

export const PING_OK_SAMPLE_50_LOSS =
  `PING localhost(localhost (::1)) 56 data bytes
64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.184 ms
64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.125 ms

--- localhost ping statistics ---
4 packets transmitted, 2 received, 50% packet loss, time 1029ms
rtt min/avg/max/mdev = 0.125/0.154/0.184/0.029 ms
`;

export const PING_OK_SAMPLE_0_LOSS =
  `PING localhost(localhost (::1)) 56 data bytes
64 bytes from localhost (::1): icmp_seq=1 ttl=64 time=0.184 ms
64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.125 ms
64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.184 ms
64 bytes from localhost (::1): icmp_seq=2 ttl=64 time=0.125 ms

--- localhost ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 1029ms
rtt min/avg/max/mdev = 0.125/0.154/0.184/0.029 ms
`;
