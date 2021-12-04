ROOT=./.ssl
FILENAME="graphql"

rm -rf "${ROOT}"

mkdir "${ROOT}"

openssl genrsa -out "${ROOT}"/"${FILENAME}_private_key".pem 1024 
openssl req -new -key  "${ROOT}"/"${FILENAME}_private_key".pem -out  "${ROOT}"/${FILENAME}_cert_request.csr -subj "/C=IN/ST=KA/L=BLR/O=ACP/OU=SELF/CN=ACP" -days 365
openssl x509 -req -in "${ROOT}"/${FILENAME}_cert_request.csr -signkey "${ROOT}"/"${FILENAME}_private_key".pem -out "${ROOT}"/${FILENAME}_certificate.pem

