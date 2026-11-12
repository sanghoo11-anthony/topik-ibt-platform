"""
Seed script to populate initial TOPIK IBT sample data into PostgreSQL.
Loads Question 13 (Reading MCQ from PROJECT_SPEC.md Section 6) along with
Questions 53 & 54 (TOPIK II Writing short & long essays + official writing rubrics).

Usage:
    python backend/db/seed.py
"""

import json
import os
import re
from typing import Any, Dict

try:
    import psycopg
except ImportError:
    import psycopg2 as psycopg  # type: ignore

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://topik_user:topik_password@localhost:5432/topik_db",
)

SAMPLE_QUESTIONS: list[Dict[str, Any]] = [
    {
        "question_id": "TOPIK-II-91-R-13",
        "test_type": "TOPIK_II",
        "section": "READING",
        "difficulty_level": 3,
        "question_type": "MULTIPLE_CHOICE",
        "passage": (
            "(가) 그러나 무조건 잠을 줄이는 것은 건강에 해롭다.\n"
            "(나) 현대인들은 바쁜 일상 속에서 수면 시간을 줄이곤 한다.\n"
            "(다) 충분한 수면을 취해야 면역력이 유지되고 집중력도 높아진다.\n"
            "(라) 따라서 건강을 지키려면 하루 7시간 이상의 숙면이 필요하다."
        ),
        "question_text": "다음 문장을 논리적 순서에 맞게 배열한 것을 고르십시오.",
        "options": [
            {"index": 1, "text": "(나) - (가) - (다) - (라)"},
            {"index": 2, "text": "(나) - (라) - (가) - (다)"},
            {"index": 3, "text": "(다) - (가) - (나) - (라)"},
            {"index": 4, "text": "(다) - (라) - (가) - (나)"},
        ],
        "correct_answer": 1,
        "score": 2,
        "explanation_multilingual": {
            "ko": (
                "(나)에서 일반적인 문제 현상을 제시한 후, (가)의 접속부사 '그러나'로 문제점을 지적하고, "
                "(다)에서 수면의 중요성을 설명한 뒤, (라)의 '따라서'로 결론을 짓는 흐름이 자연스럽습니다."
            ),
            "en": (
                "The logical sequence starts with (나) stating the general phenomenon, followed by "
                "(가) with 'however', explaining the reason in (다), and concluding with (라) 'therefore'."
            ),
        },
    },
    {
        "question_id": "TOPIK-II-91-W-53",
        "test_type": "TOPIK_II",
        "section": "WRITING",
        "difficulty_level": 4,
        "question_type": "ESSAY_SHORT",
        "passage": (
            "[조사 기관: 인주시 통계청]\n"
            "주제: 온라인 쇼핑 이용 현황 및 소비자 만족 요인\n\n"
            "1. 온라인 쇼핑 시장 규모 변화\n"
            "- 2020년: 15조 원  →  2022년: 23조 원  →  2024년: 32조 원 (4년간 2배 이상 급증)\n\n"
            "2. 소비자 만족 요인 비중 (2024년 기준)\n"
            "- 배송의 신속성 (48%) > 가격 경쟁력 (32%) > 상품의 다양성 (20%)\n\n"
            "3. 향후 전망\n"
            "- 당일 배송 서비스 확대와 합리적 가격 혜택으로 온라인 쇼핑 시장의 지속적 성장 예상"
        ),
        "question_text": (
            "다음을 참고하여 ‘온라인 쇼핑 이용 현황 및 만족 요인’에 대한 글을 200~300자로 쓰십시오. "
            "단, 글의 제목을 쓰지 마십시오. (30점)"
        ),
        "options": [],
        "correct_answer": "",
        "score": 30,
        "explanation_multilingual": {
            "ko": "도표의 수치 변화(15조 원→32조 원), 만족 요인 순위(배송 신속성 48%, 가격 경쟁력 32%, 상품 다양성 20%), 향후 전망을 객관적 문어체('-다/는다')로 서술해야 합니다.",
            "en": "Describe the market growth trend (15T -> 32T KRW), satisfaction ranking (fast delivery 48%, price 32%, variety 20%), and future outlook using formal declarative Korean endings ('-다/는다').",
        },
        "rubrics": [
            {"criteria_name": "내용 및 과제 수행", "max_score": 12.0},
            {"criteria_name": "글의 전개 구조", "max_score": 9.0},
            {"criteria_name": "한국어 어휘 및 문법 사용", "max_score": 9.0},
        ],
    },
    {
        "question_id": "TOPIK-II-91-W-54",
        "test_type": "TOPIK_II",
        "section": "WRITING",
        "difficulty_level": 6,
        "question_type": "ESSAY_LONG",
        "passage": (
            "현대 사회는 과학 기술의 발전과 경제 성장으로 물질적인 풍요를 이루었지만, "
            "과도한 경쟁과 사회적 고립감으로 인해 현대인이 느끼는 행복지수는 오히려 낮아지고 있습니다. "
            "진정한 행복을 실현하기 위한 개인적·사회적 노력에 대해 자신의 생각을 서술하십시오.\n\n"
            "[과제 수행 조건]\n"
            "1. 물질적 풍요 속에서도 현대인의 행복지수가 낮아지는 원인은 무엇인가?\n"
            "2. 행복한 삶을 위해 개인은 어떠한 태도와 가치관을 가져야 하는가?\n"
            "3. 사회와 제도는 구성원의 행복을 위해 어떤 환경을 조성해야 하는가?"
        ),
        "question_text": (
            "다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. "
            "단, 문제를 그대로 옮겨 쓰지 마십시오. (50점)"
        ),
        "options": [],
        "correct_answer": "",
        "score": 50,
        "explanation_multilingual": {
            "ko": "서론(문제 제기)-본론(원인 분석 및 개인·사회적 해결 방안)-결론(요약 및 제언)의 3단 구성을 갖추고 고급 어휘와 격식체('-다/는다')를 일관되게 사용해야 합니다.",
            "en": "Structure your essay into Introduction, Body (causes, individual & societal solutions), and Conclusion (600-700 chars) using advanced Korean vocabulary and formal written endings ('-다/는다').",
        },
        "rubrics": [
            {"criteria_name": "내용 및 과제 수행", "max_score": 20.0},
            {"criteria_name": "글의 전개 구조", "max_score": 15.0},
            {"criteria_name": "한국어 어휘 및 문법 사용", "max_score": 15.0},
        ],
    },
]

SECTION_CONFIG = {
    "TOPIK_I": {
        "LISTENING": {"order": 1, "time_limit": 40, "total_score": 100},
        "READING": {"order": 2, "time_limit": 60, "total_score": 100},
    },
    "TOPIK_II": {
        "LISTENING": {"order": 1, "time_limit": 60, "total_score": 100},
        "WRITING": {"order": 2, "time_limit": 50, "total_score": 100},
        "READING": {"order": 3, "time_limit": 70, "total_score": 100},
    },
}


def parse_question_code(code: str) -> tuple[int, int]:
    match = re.search(r"-(\d+)-[A-Z]+-(\d+)$", code)
    if not match:
        return 91, 1
    return int(match.group(1)), int(match.group(2))


def seed_database() -> None:
    print(f"Connecting to PostgreSQL: {DATABASE_URL}")
    conn = psycopg.connect(DATABASE_URL)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (email, password_hash, full_name, native_language, target_topik_level, timezone)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (email) DO UPDATE
                SET full_name = EXCLUDED.full_name
                RETURNING user_id;
                """,
                (
                    "learner@example.com",
                    "$2b$12$demo_hashed_password_placeholder",
                    "Global Learner",
                    "en",
                    4,
                    "UTC",
                ),
            )
            demo_user_id = cur.fetchone()[0]
            print(f"Upserted demo user: {demo_user_id}")

            for item in SAMPLE_QUESTIONS:
                round_num, question_num = parse_question_code(item["question_id"])
                exam_type = item["test_type"]
                section_name = item["section"]

                total_time = 180 if exam_type == "TOPIK_II" else 100
                exam_title = f"제{round_num}회 한국어능력시험 ({exam_type.replace('_', ' ')})"

                cur.execute(
                    """
                    SELECT exam_id FROM exams
                    WHERE exam_type = %s AND round_number = %s
                    LIMIT 1;
                    """,
                    (exam_type, round_num),
                )
                row = cur.fetchone()
                if row:
                    exam_id = row[0]
                else:
                    cur.execute(
                        """
                        INSERT INTO exams (title, exam_type, round_number, total_time_limit_minutes, is_published)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING exam_id;
                        """,
                        (exam_title, exam_type, round_num, total_time, True),
                    )
                    exam_id = cur.fetchone()[0]

                sec_meta = SECTION_CONFIG.get(exam_type, {}).get(
                    section_name, {"order": 1, "time_limit": 60, "total_score": 100}
                )
                cur.execute(
                    """
                    SELECT section_id FROM sections
                    WHERE exam_id = %s AND section_name = %s
                    LIMIT 1;
                    """,
                    (exam_id, section_name),
                )
                sec_row = cur.fetchone()
                if sec_row:
                    section_id = sec_row[0]
                else:
                    cur.execute(
                        """
                        INSERT INTO sections (exam_id, section_name, section_order, time_limit_minutes, total_score)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING section_id;
                        """,
                        (
                            exam_id,
                            section_name,
                            sec_meta["order"],
                            sec_meta["time_limit"],
                            sec_meta["total_score"],
                        ),
                    )
                    section_id = cur.fetchone()[0]

                cur.execute(
                    """
                    INSERT INTO questions (
                        section_id,
                        question_number,
                        question_type,
                        difficulty_level,
                        score_points,
                        passage_text,
                        prompt_text,
                        correct_answer_text,
                        explanations
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb)
                    ON CONFLICT ON CONSTRAINT uq_section_question_number
                    DO UPDATE SET
                        question_type = EXCLUDED.question_type,
                        difficulty_level = EXCLUDED.difficulty_level,
                        score_points = EXCLUDED.score_points,
                        passage_text = EXCLUDED.passage_text,
                        prompt_text = EXCLUDED.prompt_text,
                        correct_answer_text = EXCLUDED.correct_answer_text,
                        explanations = EXCLUDED.explanations
                    RETURNING question_id;
                    """,
                    (
                        section_id,
                        question_num,
                        item["question_type"],
                        item["difficulty_level"],
                        float(item["score"]),
                        item.get("passage"),
                        item["question_text"],
                        str(item["correct_answer"]) if item.get("correct_answer") else None,
                        json.dumps(item.get("explanation_multilingual", {}), ensure_ascii=False),
                    ),
                )
                db_question_id = cur.fetchone()[0]
                print(
                    f"Upserted question #{question_num} ({item['question_id']}) -> UUID {db_question_id}"
                )

                for opt in item.get("options", []):
                    cur.execute(
                        """
                        INSERT INTO question_options (question_id, option_number, option_text)
                        VALUES (%s, %s, %s)
                        ON CONFLICT ON CONSTRAINT uq_question_option
                        DO UPDATE SET option_text = EXCLUDED.option_text;
                        """,
                        (db_question_id, int(opt["index"]), opt["text"]),
                    )

                if item.get("rubrics"):
                    cur.execute(
                        "DELETE FROM writing_rubrics WHERE question_id = %s;",
                        (db_question_id,),
                    )
                    for rubric in item["rubrics"]:
                        cur.execute(
                            """
                            INSERT INTO writing_rubrics (question_id, criteria_name, max_score, description)
                            VALUES (%s, %s, %s, %s::jsonb);
                            """,
                            (
                                db_question_id,
                                rubric["criteria_name"],
                                float(rubric["max_score"]),
                                json.dumps({"criteria": rubric["criteria_name"]}, ensure_ascii=False),
                            ),
                        )

        conn.commit()
        print("Database seeding completed successfully!")
    except Exception as exc:
        conn.rollback()
        print(f"Error seeding database: {exc}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    seed_database()
