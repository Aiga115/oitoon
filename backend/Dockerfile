FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# Install the packages first, so Docker can reuse this layer when only the code changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

# Run as a normal user, not root. /data holds the SQLite file, /app/media the uploads.
RUN useradd --create-home appuser && mkdir -p /data /app/media && chown -R appuser /data /app/media
USER appuser

EXPOSE 8000
# One worker with several threads: the recommender cache lives in the process memory,
# so a second worker would keep a stale copy.
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1 --threads 4"]